// /pages/api/filters/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../../middleware/authMiddleware";
import connectToDatabase from "../../../lib/db/mongodb";
import { FilterModel } from "../../../lib/models/Filter";

/**
 * Handles API requests to manage user filters
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the database
  await connectToDatabase();
  const userId = req.user.id;

  // Handle different HTTP methods
  switch (req.method) {
    case "GET":
      // Handle GET requests to retrieve filters
      return getFilters(req, res, userId);
    case "POST":
      // Handle POST requests to save a new filter
      return saveFilter(req, res, userId);
    default:
      // Return a 405 error for unsupported methods
      return res.status(405).json({ error: "Method not allowed" });
  }
};

export default authenticate(handler);

/**
 * Handles GET requests to retrieve filters for a user
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
const getFilters = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const filters = await FilterModel.find({ userId });
    // Return the list of filters in the response
    return res.status(200).json({ filters });
  } catch (error) {
    console.error("Error fetching filters:", error);
    // Return a 500 error if there is an internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Handles POST requests to save a new filter or update an existing one
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @param {string} userId - The ID of the user
 * @returns {Promise<void>}
 */
const saveFilter = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  try {
    const { filterId, filterName, criteria } = req.body;

    // Validate the input
    if (!filterName || !criteria) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the filter to update
    let filter;
    if (filterId) {
      filter = await FilterModel.findOneAndUpdate(
        { _id: filterId, userId },
        { filterName, criteria },
        { new: true }
      );
    } else {
      // Create a new filter if the filter ID is not provided
      filter = new FilterModel({
        userId,
        filterName,
        criteria,
      });
      await filter.save();
    }

    return res.status(200).json({ filter });
  } catch (error) {
    console.error("Error saving filter:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
