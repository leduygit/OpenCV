import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { verifyEmail } from "../../../services/authService";
import { checkMethod } from "@/middleware/checkMethod";
import { handleApiError } from "@/middleware/errorHandler";

export default async function verifyEmailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkMethod("POST")(req, res, async () => {
    try {
      await dbConnect();
      const { token } = req.body;
      await verifyEmail(token);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      handleApiError(res, error);
    }
  });
}
