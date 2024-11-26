// /scripts/seedJobs.ts
import connectToDatabase from "@/lib/db/mongodb";
import { JobModel, IJob } from "@/lib/models/Job";
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

    // Pass combined_text directly when saving the job
    await saveJob(job, pineconeIndex);
  }

  console.log("Jobs seeded successfully.");
  process.exit(0);
}

async function saveJobToMongoDB(job: any): Promise<IJob> {
  const { combined_text, ...jobData } = job; // Remove combined_text before saving
  const existingJob = await JobModel.findOne({
    title: jobData.title,
    companyName: jobData.companyName,
  });

  if (!existingJob) {
    const newJob = await JobModel.create(jobData);
    return newJob;
  }

  return existingJob; // Return existing job if already present
}

async function saveJobToPinecone(job: any, pineconeIndex: any) {
  if (!job.combined_text) {
    throw new Error(
      "Job data must include `combined_text` to generate an embedding."
    );
  }

  // Generate embedding from combined_text
  const response = await axios.post(`${process.env.FASTAPI_URL}/embed`, {
    text: job.combined_text,
  });

  const embedding = response.data.embedding;

  // Save embedding to Pinecone
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
}

async function saveJob(job: any, pineconeIndex: any) {
  // 1. Save job to MongoDB
  const savedJob = await saveJobToMongoDB(job);

  // 2. Save embedding to Pinecone using combined_text
  await saveJobToPinecone({ ...job, _id: savedJob._id }, pineconeIndex);
}
