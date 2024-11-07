import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/dbConnect";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();
    res.status(200).json({ success: true, message: "Database connected!" });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Database connection failed!" });
  }
}
