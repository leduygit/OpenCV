// /scripts/generateJobEmbeddings.ts
import connectToDatabase from "../lib/db/mongodb";
import { JobModel } from "../lib/models/Job";
import axios from "axios";
import { pineconeIndex } from "../lib/db/pinecone";

async function generateJobEmbeddings() {
  await connectToDatabase();

  const jobs = await JobModel.find({});

  for (const job of jobs) {
    try {
      // Gọi FastAPI để tạo embedding
      const response = await axios.post("http://localhost:8000/embed-text", {
        text: job.jobDescription,
      });

      const embedding = response.data.embedding;

      // Lưu embedding vào Pinecone
      await pineconeIndex.upsert({
        id: job._id.toString(),
        values: embedding,
        metadata: {
          title: job.title,
          industry: job.industry,
          location: job.location,
        },
        namespace: "jobs",
      });

      console.log(`Embedding generated for job ${job.title}`);
    } catch (error) {
      console.error(`Error generating embedding for job ${job.title}:`, error);
    }
  }

  console.log("Job embeddings generated successfully.");
  process.exit(0);
}

generateJobEmbeddings().catch((error) => {
  console.error("Error in generating job embeddings:", error);
  process.exit(1);
});
