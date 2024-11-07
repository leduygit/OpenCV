import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { resetPassword } from "../../../services/authService";
import { checkMethod } from "@/middleware/checkMethod";
import { handleApiError } from "@/middleware/errorHandler";

export default async function resetPasswordHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkMethod("POST")(req, res, async () => {
    try {
      await dbConnect();
      const { token, newPassword } = req.body;
      await resetPassword(token, newPassword);
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      handleApiError(res, error);
    }
  });
}
