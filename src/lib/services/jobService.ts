// /lib/services/jobService.ts
import { JobModel } from "../models/Job";
import axios from "axios";

interface JobSearchCriteria {
  keyword?: string;
  location?: string;
  industry?: string;
  salaryRange?: string;
  experienceLevel?: string;
  skills?: string[];
}

export const jobService = {
  /**
   * Searches for jobs based on the given criteria.
   *
   * @param {JobSearchCriteria} criteria - The search criteria.
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=10] - The number of jobs to return per page.
   * @returns {Promise<Job[]>} - The list of jobs that match the search criteria.
   */
  searchJobs: async (
    criteria: JobSearchCriteria,
    page: number = 1,
    limit: number = 10
  ) => {
    // Create a MongoDB query based on the search criteria
    const query: any = {};

    // If the keyword is provided, search for jobs that have the keyword in their
    // title, company name, or job description
    if (criteria.keyword) {
      query.$text = { $search: criteria.keyword };
    }

    // If the location is provided, search for jobs that have the location in their
    // location field
    if (criteria.location) {
      query.location = criteria.location;
    }

    // If the industry is provided, search for jobs that have the industry in their
    // industry field
    if (criteria.industry) {
      query.industry = criteria.industry;
    }

    // If the salary range is provided, search for jobs that have the salary range in
    // their salaryRange field
    if (criteria.salaryRange) {
      query.salaryRange = criteria.salaryRange;
    }

    // If the experience level is provided, search for jobs that have the experience
    // level in their requiredExperience field
    if (criteria.experienceLevel) {
      query.requiredExperience = criteria.experienceLevel;
    }

    // If the skills are provided, search for jobs that have all the skills in their
    // skillsRequired field
    if (criteria.skills && criteria.skills.length > 0) {
      query.skillsRequired = { $all: criteria.skills };
    }

    // Find the jobs in the database and skip the number of jobs that are before the
    // current page, and limit the number of jobs to the number of jobs per page
    const jobs = await JobModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    return jobs;
  },

  /**
   * Searches for jobs based on query similarity using an external service.
   *
   * @param {string} query - The search query string.
   * @param {number} [topK=10] - The number of top similar jobs to return.
   * @returns {Promise<any[]>} - A promise that resolves to a list of job results.
   */
  searchJobsWithSimilarity: async (query: string, topK: number = 10) => {
    // Send a POST request to the external service with the query and topK parameters
    const response = await axios.post("http://localhost:8000/search-jobs", {
      query,
      top_k: topK,
    });

    // Extract the results from the response
    const results = response.data.results;

    // Return the results to the caller
    return results;
  },
};
