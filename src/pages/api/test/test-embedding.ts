// /pages/api/tests/test-embedding.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type ResponseData = {
  success: boolean;
  embedding?: number[] | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing "text" in request body',
    });
  }

  try {
    const response = await axios.post("http://127.0.0.1:8000/embed", { text });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to generate embedding" });
  }
}
