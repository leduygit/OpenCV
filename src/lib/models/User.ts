// /lib/models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  is2FAEnabled: boolean;
  twoFactorSecret?: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
});

// Pre-save hook to hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare password
/**
 * Compares a given password with the stored password hash.
 *
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the password matches the hash.
 */
UserSchema.methods.comparePassword = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  // Use bcrypt to compare the provided password with the stored hash
  // By default, bcrypt.compare() uses the same salt as the stored hash, so we don't need to generate a new salt
  return bcrypt.compare(password, this.passwordHash);
};

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
