// /pages/api/jobs/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { JobModel } from "../../../lib/models/Job";
import { authenticate } from "../../../middleware/authMiddleware";

/**
 * Handles API requests to get a job by ID
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await connectToDatabase();

  const {
    query: { id }, // The ID of the job to fetch
    method, // The HTTP method of the request
  } = req;

  switch (method) {
    case "GET":
      // Handle GET requests to fetch a job by ID
      return getJobById(req, res, id as string);
    default:
      // Return a 405 error for unsupported methods
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

/**
 * Retrieves a job by its ID and sends it in the response.
 *
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @param {string} jobId - The ID of the job to retrieve.
 * @returns {Promise<void>}
 */
const getJobById = async (
  req: NextApiRequest,
  res: NextApiResponse,
  jobId: string
): Promise<void> => {
  try {
    // Find the job in the database using the provided job ID
    const job = await JobModel.findById(jobId);

    // If the job is not found, return a 404 error response
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Return the job data in a 200 OK response
    return res.status(200).json({ job });
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("Error fetching job by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default authenticate(handler);
