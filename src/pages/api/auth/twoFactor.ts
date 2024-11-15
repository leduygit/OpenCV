// /pages/api/auth/twoFactor.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { authService } from "@/lib/services/authService";
import QRCode from "qrcode";

/**
 * Handles 2FA actions (enable, verify) for the given user
 *
 * @param {NextApiRequest} req - The incoming request object
 * @param {NextApiResponse} res - The response object to send the results
 * @returns {Promise<void>} - A promise that resolves when the request is complete
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  const { userId, action, token } = req.body;

  if (!userId || !action) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Enable 2FA
    if (action === "enable") {
      const otpauthUrl = await authService.enable2FA(userId);
      if (!otpauthUrl) {
        return res
          .status(500)
          .json({ error: "Failed to generate OTP auth URL" });
      }

      // Generate QR code
      const qrCode = await QRCode.toDataURL(otpauthUrl);
      return res.status(200).json({ message: "2FA enabled", qrCode });
    }

    // Verify 2FA token
    if (action === "verify") {
      if (!token) {
        return res
          .status(400)
          .json({ error: "Missing token for verification" });
      }

      const verified = await authService.verify2FA(userId, token);
      if (verified) {
        // Generate JWT
        const jwt = generateJWT(userId);
        return res.status(200).json({ message: "2FA verified", token: jwt });
      } else {
        return res.status(401).json({ error: "Invalid 2FA token" });
      }
    }

    // Invalid action
    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("Error handling 2FA:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Helper function to generate JWT
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

function generateJWT(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
