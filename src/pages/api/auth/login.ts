// src/pages/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { loginUser } from "../../../services/authService";
import { checkMethod } from "@/middleware/checkMethod";
import { handleApiError } from "@/middleware/errorHandler";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  checkMethod("POST")(req, res, async () => {
    try {
      await dbConnect();
      const { email, password } = req.body;
      const { user, token } = await loginUser(email, password);
      res.status(200).json({ token, user });
    } catch (error) {
      handleApiError(res, error);
    }
  });
}
