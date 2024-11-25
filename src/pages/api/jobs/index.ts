// /pages/api/jobs/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../../lib/db/mongodb";
import { jobService } from "../../../lib/services/jobService";
import { JobModel } from "../../../lib/models/Job";
/**
 * Handles GET requests to search for jobs
 *
 * @param {NextApiRequest} req - Next.js API request
 * @param {NextApiResponse} res - Next.js API response
 * @returns {Promise<void>}
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();

  if (req.method !== "GET") {
    // Return 405 if the request method is not GET
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the search criteria from the query string
    const {
      keyword,
      location,
      industry,
      salaryRange,
      experienceLevel,
      skills,
      page = 1,
      limit = 10,
      useVectorSearch = false,
    } = req.query;

    const criteria = {
      // Search for jobs with the given keyword
      keyword: keyword as string,
      // Search for jobs in the given location
      location: location as string,
      // Search for jobs in the given industry
      industry: industry as string,
      // Search for jobs with the given salary range
      salaryRange: salaryRange as string,
      // Search for jobs with the given experience level
      experienceLevel: experienceLevel as string,
      // Search for jobs with the given skills
      skills: skills ? (Array.isArray(skills) ? skills : [skills]) : undefined,
    };

    if (keyword && useVectorSearch) {
      // Call the jobService to search for jobs with the given criteria using vector search
      const results = await jobService.searchJobsWithSimilarity(
        keyword as string,
        Number(limit)
      );

      // Get the job IDs from the search results
      const jobIds = results.matches.map((match: any) => match.id);

      // Find the jobs in the database with the given job IDs
      const jobs = await JobModel.find({ _id: { $in: jobIds } });

      // Return the list of jobs in the response
      return res.status(200).json({ jobs });
    }

    // Call the jobService to search for jobs with the given criteria
    const jobs = await jobService.searchJobs(
      criteria,
      Number(page),
      Number(limit)
    );

    // Return the list of jobs in the response
    return res.status(200).json({ total: jobs.length, jobs });
  } catch (error) {
    // Log the error
    console.error("Error searching jobs:", error);
    // Return a 500 error if there is an internal server error
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
