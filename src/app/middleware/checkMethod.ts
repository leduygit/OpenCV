import { NextApiRequest, NextApiResponse } from "next";

export function checkMethod(allowedMethod: string) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    if (req.method !== allowedMethod) {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
    next();
  };
}