import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/user";

const SALT_WORK_FACTOR = 10;

// Định nghĩa schema của người dùng
const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true, trim: true }, // Validation cho name
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email address"], // Validation cho email
  },
  password: { type: String, required: true }, // Mật khẩu bắt buộc
  isVerified: { type: Boolean, default: false }, // Kiểm tra xem người dùng đã xác minh chưa
  resetPasswordToken: { type: String }, // Token để reset mật khẩu
  resetPasswordExpires: { type: Date }, // Thời hạn hết hạn của token reset mật khẩu
  verificationToken: { type: String }, // Token xác minh email
  createdAt: { type: Date, default: Date.now }, // Ngày tạo tài khoản
});

// Mã hóa mật khẩu trước khi lưu người dùng
UserSchema.pre("save", async function (next) {
  const user = this as unknown as IUser;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Thêm phương thức so sánh mật khẩu
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

// Tạo hoặc sử dụng model User
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;