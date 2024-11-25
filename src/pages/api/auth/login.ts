// /pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { UserModel } from "../../../lib/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in your .env file");
}

/**
 * Handles user login requests.
 *
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send the results.
 * @returns {Promise<void>} - A promise that resolves when the request is complete.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  if (req.method !== "POST") {
    // Only POST requests are allowed
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emailOrUsername, password } = req.body;

  // Validate input fields
  if (!emailOrUsername || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find user by email or username
    const user = await UserModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      // User not found
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Password does not match
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if two-factor authentication is enabled
    if (user.is2FAEnabled) {
      // Notify client that 2FA is required
      return res
        .status(200)
        .json({ message: "2FA required", userId: user._id });
    }

    // Generate a JSON Web Token for the user
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with success message and token
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    // Handle any server errors
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
