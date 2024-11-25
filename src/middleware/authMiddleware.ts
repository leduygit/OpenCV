// /middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt from "jsonwebtoken";
import { CustomNextApiRequest } from "@/types/api";
const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * A middleware function that verifies the authentication token in the
 * Authorization header and appends the user ID to the request object.
 *
 * @param {NextApiHandler} handler The API route handler to call if the
 *                                  token is valid.
 * @returns {NextApiHandler} A middleware function that calls the handler if
 *                           the token is valid, or returns a 401 error
 *                           response if the token is invalid or missing.
 */
export function authenticate(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      // If no token is provided, return a 401 error
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      // Verify the token and extract the user ID
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      (req as CustomNextApiRequest).user = { id: decoded.userId };
      // Call the handler with the authenticated request
      return handler(req, res);
    } catch (error) {
      // If the token is invalid or expired, return a 401 error
      return res
        .status(401)
        .json({ error: "Invalid or expired token", details: error });
    }
  };
}
