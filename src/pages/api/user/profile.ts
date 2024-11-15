// /pages/api/user/profile.ts
import type { NextApiResponse, NextApiHandler } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { authenticate } from "../../../middleware/authMiddleware";
import { UserModel } from "../../../lib/models/User";
import { CustomNextApiRequest } from "@/types/api";
/**
 * @description
 * A Next.js API route that returns the user's profile data when given a valid
 * authentication token. The user's password and 2FA secret are not included in
 * the response.
 *
 * @function
 * @param {NextApiRequest} req - The Next.js request object, extended with user ID.
 * @param {NextApiResponse} res - The Next.js response object.
 * @returns {Promise<void>} - A promise that resolves with no value.
 */
const handler: (
  req: CustomNextApiRequest,
  res: NextApiResponse
) => Promise<void> = async (req, res) => {
  // Connect to MongoDB
  await connectToDatabase();

  // Find the user in the database
  const user = await UserModel.findById(req.user?.id).select(
    "-passwordHash -twoFactorSecret"
  );
  // If the user is not found, return a 404 error
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Return the user's data in the response
  return res.status(200).json({ user });
};

export default authenticate(handler as NextApiHandler);
