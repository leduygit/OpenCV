// /scripts/generateJobEmbeddings.ts
import connectToDatabase from "../lib/db/mongodb";
import { JobModel } from "../lib/models/Job";
import axios from "axios";
import { pineconeIndex } from "../lib/db/pinecone";

/**
 * Generates embeddings for all jobs in the database and saves them to Pinecone.
 */
async function generateJobEmbeddings() {
  // Connect to the database
  await connectToDatabase();

  // Get all jobs from the database
  const jobs = await JobModel.find({});

  // Process each job and generate an embedding
  for (const job of jobs) {
    try {
      // Call FastAPI to generate an embedding for the job description
      const response = await axios.post("http://localhost:8000/embed-text", {
        text: job.jobDescription,
      });

      const embedding = response.data.embedding;

      // Upsert the embedding to Pinecone
      await pineconeIndex.upsert([
        {
          id: job._id.toString(),
          values: embedding,
          metadata: {
            title: job.title,
            industry: job.industry,
            location: job.location,
          },
        },
      ]);

      // Print a success message
      console.log(`Embedding generated for job ${job.title}`);
    } catch (error) {
      // Print an error message if something goes wrong
      console.error(`Error generating embedding for job ${job.title}:`, error);
    }
  }

  // Print a final success message
  console.log("Job embeddings generated successfully.");
  // Exit the process with a success code
  process.exit(0);
}

generateJobEmbeddings().catch((error) => {
  console.error("Error in generating job embeddings:", error);
  process.exit(1);
});
