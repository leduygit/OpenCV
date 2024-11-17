// /pages/api/test-pinecone.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db/mongodb";
import { seedJobs } from "../../../scripts/seedJobs";
/**
 * Tests MongoDB connection
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Connecting to MongoDB...");
    await seedJobs().then(() => {
      console.log("Seeded jobs into MongoDB.");
      res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error("Error seeding jobs:", error);
    res.status(500).json({ error: "Failed to seed jobs" });
  }
}
