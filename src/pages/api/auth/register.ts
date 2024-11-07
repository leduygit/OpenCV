import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { registerUser } from "../../../services/authService";
import { checkMethod } from "@/middleware/checkMethod";
import { handleApiError } from "@/middleware/errorHandler";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkMethod("POST")(req, res, async () => {
    try {
      await dbConnect();
      const { name, email, password } = req.body;
      const user = await registerUser(name, email, password);
      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        user,
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });
}
