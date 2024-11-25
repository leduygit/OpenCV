// /lib/services/userService.ts
import { UserModel, IUser } from "../models/User";

export const userService = {
  /**
   * Tìm người dùng theo ID.
   * @param userId ID của người dùng.
   * @returns Thông tin người dùng.
   */
  getUserById: async (userId: string): Promise<IUser | null> => {
    try {
      const user = await UserModel.findById(userId).select(
        "-passwordHash -twoFactorSecret"
      );
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin người dùng.
   * @param userId ID của người dùng.
   * @param updateData Dữ liệu cập nhật.
   * @returns Thông tin người dùng đã cập nhật.
   */
  updateUser: async (
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> => {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
      });
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  /**
   * Các hàm dịch vụ khác liên quan đến người dùng.
   */
};
