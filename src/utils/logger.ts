// utils/email.ts

import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;
const BASE_URL = process.env.BASE_URL as string; // e.g., http://localhost:3000

const transporter = nodemailer.createTransport({
  service: "Gmail", // hoặc SMTP server khác
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${BASE_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });
}
