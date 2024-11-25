// /pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";

/**
 * Handles the logout request
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    // Only POST requests are allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Return a 200 response with a success message
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Log any errors
    console.error("Error logging out:", error);
    // Return a 500 response with an error message
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default authenticate(handler);
