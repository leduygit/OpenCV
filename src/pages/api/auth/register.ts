// /pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { UserModel } from "../../../lib/models/User";
import { isEmail, isLength } from "validator";

/**
 * Registers a new user
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to MongoDB
  await connectToDatabase();

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get the username, email, and password from the request body
  const { username, email, password } = req.body;

  // Validate the input
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate the email address
  if (!isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Validate the password length
  if (!isLength(password, { min: 6 })) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  try {
    // Check if user exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      // Return 409 if the user already exists
      return res
        .status(409)
        .json({ error: "Email or username already in use" });
    }

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      passwordHash: password,
    });

    // Save the new user
    await newUser.save();

    // Return 201 if the user was created successfully
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Return 500 if an error occurred
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
