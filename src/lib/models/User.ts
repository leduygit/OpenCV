// /lib/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  is2FAEnabled: boolean;
  twoFactorSecret?: string;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
});

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
