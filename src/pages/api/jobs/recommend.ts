// /pages/api/jobs/recommend.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import { recommendJobs } from "../../../lib/services/jobRecommender";
import { CVModel } from "../../../lib/models/CV";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const userId = req.user.id;

    // console.log("User ID:", userId);

    // Lấy CV mới nhất của người dùng
    const userCV = await CVModel.findOne({ userId }).sort({ uploadedAt: -1 });

    // console.log("User CV:", userCV);

    if (!userCV) {
      return res.status(404).json({ error: "No CV found for the user." });
    }

    // Gọi hàm recommendJobs
    const recommendations = await recommendJobs(userCV._id.toString(), 10);

    // console.log("Recommendations:", recommendations);

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error in /jobs/recommend:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default authenticate(handler);
