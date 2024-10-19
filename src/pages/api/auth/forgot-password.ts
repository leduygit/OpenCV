import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { initiateResetPassword } from "../../../services/authService";
import { checkMethod } from "@/middleware/checkMethod";
import { handleApiError } from "@/middleware/errorHandler";

export default async function forgotPassword(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkMethod("POST")(req, res, async () => {
    try {
      await dbConnect();
      const { email } = req.body;
      await initiateResetPassword(email);
      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      handleApiError(res, error);
    }
  });
}
