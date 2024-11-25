// /pages/api/user/interactions.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import connectToDatabase from "../../../lib/db/mongodb";
import {
  InteractionModel,
  InteractionType,
} from "../../../lib/models/Interaction";
import { JobModel } from "../../../lib/models/Job";

/**
 * Handles API requests to manage user interactions with jobs
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();
  const userId = req.user.id;

  // Handle GET requests to get interactions
  if (req.method === "GET") {
    return getInteractions(req, res, userId);
  }

  // Handle POST requests to add a new interaction
  if (req.method === "POST") {
    return addInteraction(req, res, userId);
  }

  // Handle DELETE requests to delete an interaction
  if (req.method === "DELETE") {
    return deleteInteraction(req, res, userId);
  }

  // Handle all other methods by returning a 405 error
  return res.status(405).json({ error: "Method not allowed" });
};

export default authenticate(handler);

/**
 * Handles GET requests to get user interactions with jobs
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
const getInteractions = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    // Get the interaction type from the query string
    const { interactionType } = req.query;

    // Create a query to filter the interactions based on the interaction type
    const query: any = { userId };

    if (interactionType) {
      query.interactionType = interactionType;
    }

    // Find the interactions in the database and populate the jobId field
    const interactions = await InteractionModel.find(query)
      .populate("jobId")
      .sort({ createdAt: -1 });

    // Return the list of interactions in the response
    return res.status(200).json({ interactions });
  } catch (error) {
    console.error("Error fetching interactions:", error);
    // Return a 500 error if there is an internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * Handles POST requests to add a new interaction
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
const addInteraction = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const { jobId, interactionType, notes } = req.body;

    if (!jobId || !interactionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /**
     * Validate the interaction type against a list of valid values
     */
    const validInteractionTypes: InteractionType[] = [
      "viewed",
      "saved",
      "applied",
    ];
    if (!validInteractionTypes.includes(interactionType)) {
      return res.status(400).json({ error: "Invalid interaction type" });
    }

    /**
     * Check if the job exists in the database
     */
    const jobExists = await JobModel.exists({ _id: jobId });
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    /**
     * Create or update an interaction in the database with the given data
     */
    const interaction = await InteractionModel.findOneAndUpdate(
      { userId, jobId, interactionType },
      { notes, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ interaction });
  } catch (error) {
    console.error("Error adding interaction:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handles DELETE requests to delete an interaction with a job
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user who made the interaction
 * @returns {Promise<void>}
 */
const deleteInteraction = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const { jobId, interactionType } = req.body;

    if (!jobId || !interactionType) {
      // Return 400 if the required fields are not provided
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find and delete the interaction in the database
    await InteractionModel.findOneAndDelete({ userId, jobId, interactionType });

    // Return 200 with a success message
    return res
      .status(200)
      .json({ message: "Interaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting interaction:", error);
    // Return 500 if there is an internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};
