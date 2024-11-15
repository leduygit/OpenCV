// /pages/api/test-pinecone.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pinecone } from "@/lib/db/pinecone";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const indexes = await pinecone.listIndexes();
    res.status(200).json({ indexes });
  } catch (error) {
    console.error("Error connecting to Pinecone:", error);
    res.status(500).json({ error: "Failed to connect to Pinecone" });
  }
}
