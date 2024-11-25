// /pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import { userService } from "../../../lib/services/userService";
import connectToDatabase from "../../../lib/db/mongodb";

/**
 * Handles API requests to manage user profiles
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await connectToDatabase();
  const userId = req.user.id;

  switch (req.method) {
    case "GET":
      // Handle GET requests to get user profile
      return getUserProfile(req, res, userId);

    case "PUT":
      // Handle PUT requests to update user profile
      return updateUserProfile(req, res, userId);

    default:
      // Return 405 error for unsupported methods
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default authenticate(handler);

/**
 * Retrieves a user profile based on the user ID.
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user whose profile is to be retrieved
 * @returns {Promise<void>}
 */
const getUserProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
): Promise<void> => {
  try {
    // Fetch user details from the database using the user ID
    const user = await userService.getUserById(userId);

    // If the user is not found, return a 404 error response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data in a 200 OK response
    return res.status(200).json({ user });
  } catch (error) {
    // Log any error that occurs and return a 500 Internal Server Error response
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Updates a user profile based on the user ID and update data.
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user whose profile is to be updated
 * @returns {Promise<void>}
 */
const updateUserProfile = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    // Extract the update data from the request body
    const updateData = req.body;

    // Update the user profile in the database using the user ID and update data
    const user = await userService.updateUser(userId, updateData);

    // If the user is not found, return a 404 error response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user data in a 200 OK response
    return res.status(200).json({ user });
  } catch (error) {
    // Log any error that occurs and return a 500 Internal Server Error response
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
