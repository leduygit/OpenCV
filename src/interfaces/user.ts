// src/interfaces/user.ts

import { Document } from "mongoose";

// Định nghĩa interface IUser cho người dùng
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
