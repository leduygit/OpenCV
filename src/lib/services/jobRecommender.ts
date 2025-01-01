// /lib/services/jobRecommender.ts
import { pineconeIndex } from "../db/pinecone";
import { JobModel } from "../models/Job";
import axios from "axios";
interface JobRecommendation {
  job: any;
  score: number;
}

export async function recommendJobs(
  cvId: string,
  topK: number = 10
): Promise<JobRecommendation[]> {
  try {
    // Send embedding to FastAPI for recommendations
    console.log("Querying FastAPI for job recommendations...");
    const response = await axios.post(
      `${process.env.FASTAPI_URL}/recommend-jobs`,
      {
        cvId,
        top_k: topK,
      }
    );

    const queryResponse = response.data;

    if (!queryResponse.matches) {
      console.log("No matches found from FastAPI.");
      return [];
    }

    const jobIds = queryResponse.matches.map((match) => match.id);
    console.log("Matched job IDs:", jobIds);

    // Fetch job details from MongoDB
    console.log("Fetching job details from MongoDB...");
    const jobs = await JobModel.find({ _id: { $in: jobIds } });

    // Combine job details with scores
    const recommendations = jobs.map((job) => {
      const match = queryResponse.matches.find(
        (m) => m.id === job._id.toString()
      );
      return {
        job,
        score: match?.score || 0,
      };
    });

    console.log("Job recommendations prepared successfully.");
    return recommendations;
  } catch (error) {
    console.error("Error in recommendJobs:", error.message || error);
    throw error;
  }
}
