// /lib/services/jobRecommender.ts
import { pineconeIndex } from "../db/pinecone";
import { JobModel } from "../models/Job";

interface JobRecommendation {
  job: any;
  score: number;
}

/**
 * Recommends jobs based on the user's CV embedding.
 *
 * @param {string} cvId The ID of the user's CV.
 * @param {number} topK The number of top similar jobs to return.
 * @returns {Promise<JobRecommendation[]>} A list of recommended jobs with similarity scores.
 */
export async function recommendJobs(
  cvId: string,
  topK: number = 10
): Promise<JobRecommendation[]> {
  try {
    // Lấy embedding của CV từ Pinecone
    // console.log("Starting fetch...", cvId);
    // console.log("Type of cvId:", typeof cvId);
    const cvEmbeddingResult = await pineconeIndex.fetch([cvId]);

    // console.log("cvEmbeddingResult:", cvEmbeddingResult);

    if (!cvEmbeddingResult.records[cvId]) {
      throw new Error("CV embedding not found in Pinecone.");
    }

    const cvEmbedding = cvEmbeddingResult.records[cvId].values;

    // console.log(cvEmbedding);

    // Thực hiện truy vấn similarity trong Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: cvEmbedding,
      topK: topK,
      includeValues: false,
      includeMetadata: true,
    });

    // Lấy danh sách job IDs
    const jobIds = queryResponse.matches?.map((match) => match.id) || [];

    // Lấy thông tin chi tiết công việc từ MongoDB
    const jobs = await JobModel.find({ _id: { $in: jobIds } });

    // Kết hợp thông tin công việc với điểm số
    const recommendations = jobs.map((job) => {
      const match = queryResponse.matches?.find(
        (m) => m.id === job._id.toString()
      );
      return {
        job,
        score: match?.score || 0,
      };
    });

    return recommendations;
  } catch (error) {
    console.error("Error in recommendJobs:", error);
    throw error;
  }
}
