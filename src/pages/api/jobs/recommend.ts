// /pages/api/jobs/recommend.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import { recommendJobs } from "../../../lib/services/jobRecommender";
import { CVModel } from "../../../lib/models/CV";

/**
 * Handles GET requests to the /jobs/recommend endpoint, which returns a list of job recommendations
 * for the user based on the user's CV.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the user ID from the request
    const userId = req.user.id;

    // Find the most recent CV for the user
    const userCV = await CVModel.findOne({ userId }).sort({ uploadedAt: -1 });

    // If no CV is found, return a 404 error response
    if (!userCV) {
      return res.status(404).json({ error: "No CV found for the user." });
    }

    // Get the list of job recommendations from the job recommender service
    const recommendations = await recommendJobs(userCV._id.toString(), 10);

    // Return the list of job recommendations in the response
    return res.status(200).json({ recommendations });
  } catch (error) {
    // Log any error that occurs and return a 500 Internal Server Error response
    console.error("Error in /jobs/recommend:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default authenticate(handler);
