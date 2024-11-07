// src/services/authService.ts

import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import { sendVerificationEmail, sendResetPasswordEmail } from "../utils/email";
import { config } from "../config/env";

const JWT_SECRET = config.JWT_SECRET;
const JWT_EXPIRES_IN = config.JWT_EXPIRES_IN;

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const user = new User({
    name,
    email,
    password,
    verificationToken: crypto.randomBytes(32).toString("hex"),
  });
  await user.save();
  await sendVerificationEmail(user.email, user.verificationToken as string);
  return user;
}

export async function verifyEmail(token: string) {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new Error("Invalid or expired verification token");
  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (!user.isVerified) throw new Error("Email not verified");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  return { user, token };
}

export async function initiateResetPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  await sendResetPasswordEmail(user.email, user.resetPasswordToken);
}

export async function resetPassword(token: string, newPassword: string) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new Error("Invalid or expired reset token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}

