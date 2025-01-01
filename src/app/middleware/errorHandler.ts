// src/middleware/errorHandler.ts

import { NextApiResponse } from "next";

export function handleApiError(res: NextApiResponse, error: unknown) {
  if (error instanceof Error) {
    return res.status(400).json({ message: error.message });
  } else {
    return res.status(500).json({ message: "An unknown error occurred" });
  }
}