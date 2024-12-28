// /pages/api/test-pinecone.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { seedJobs } from "../../../scripts/seedJobs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await seedJobs().then(() => {
      console.log("Seeded jobs into MongoDB.");
      res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error("Error seeding jobs:", error);
    res.status(500).json({ error: "Failed to seed jobs" });
  }
}
