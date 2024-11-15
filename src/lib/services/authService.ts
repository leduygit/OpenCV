// /lib/services/authService.ts
import { UserModel } from "../models/User";
import speakeasy from "speakeasy";

export const authService = {
  /**
   * Enables two-factor authentication for the specified user by generating a secret.
   *
   * @param {string} userId - The ID of the user for whom 2FA is being enabled.
   * @returns {Promise<string | undefined>} - A promise that resolves to the OTP auth URL or undefined if an error occurs.
   */
  enable2FA: async (userId: string): Promise<string | undefined> => {
    // Generate a new secret for two-factor authentication
    const secret = speakeasy.generateSecret({ length: 20 });

    // Update the user's record in the database with the new secret and enable 2FA
    await UserModel.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32,
      is2FAEnabled: true,
    });

    // Return the OTP auth URL for use in apps like Google Authenticator
    return secret.otpauth_url;
  },

  /**
   * Verifies a two-factor authentication token for the specified user.
   *
   * @param {string} userId - The ID of the user for whom the token is being verified.
   * @param {string} token - The two-factor authentication token to verify.
   * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the token is valid.
   */
  verify2FA: async (userId: string, token: string): Promise<boolean> => {
    // Retrieve the user's record from the database
    const user = await UserModel.findById(userId);
    if (!user || !user.twoFactorSecret) {
      // If the user is not found or 2FA is not enabled, throw an error
      throw new Error("2FA not enabled");
    }

    // Use the Speakeasy library to verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    // Return the result of the verification
    return verified;
  },
};
