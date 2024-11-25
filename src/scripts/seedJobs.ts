import connectToDatabase from "@/lib/db/mongodb";
import { JobModel } from "@/lib/models/Job";
import fs from "fs";
import { pinecone } from "@/lib/db/pinecone"; // Import Pinecone client
import axios from "axios";

const INDEX_NAME = process.env.PINECONE_INDEX_NAME; // Ensure this variable is set in .env

if (!INDEX_NAME) {
  throw new Error(
    "PINECONE_INDEX_NAME is not defined in environment variables."
  );
}

const pineconeIndex = pinecone.Index(INDEX_NAME);

/**
 * Seeds the jobs collection in the database with jobs from the jobs.json file.
 * If a job with the same title and company name already exists in the database,
 * it is not overwritten. Instead, the existing job is used.
 *
 * For each job, an embedding is generated using the FastAPI endpoint and then
 * upserted into Pinecone.
 *
 * @returns {Promise<void>}
 */
export async function seedJobs() {
  await connectToDatabase();

  const jobs = JSON.parse(
    fs.readFileSync("./AI/data_processing/job/jobs.json", "utf8")
  );

  for (const job of jobs) {
    if (typeof job.skillsRequired === "string") {
      job.skillsRequired = JSON.parse(job.skillsRequired.replace(/'/g, '"'));
    }

    const existingJob = await JobModel.findOne({
      title: job.title,
      companyName: job.companyName,
    });

    let savedJob = existingJob;
    if (!existingJob) {
      savedJob = await JobModel.create(job);
    }

    // Generate an embedding for the job description using the FastAPI endpoint
    // const response = await axios.post("http://127.0.0.1:8000/embed", {
    //   text: job.combined_text,
    // });

    // const embedding = response.data.embedding;

    // Upsert the job embedding to Pinecone
    // await pineconeIndex.upsert([
    //   {
    //     id: savedJob._id.toString(),
    //     values: embedding,
    //     metadata: {
    //       title: job.title,
    //       industry: job.industry,
    //       location: job.location,
    //     },
    //   },
    // ]);
  }

  console.log("Jobs seeded successfully.");
  process.exit(0);
}

// seedJobs().catch((error) => {
//   console.error("Error seeding jobs:", error);
//   process.exit(1);
// });
