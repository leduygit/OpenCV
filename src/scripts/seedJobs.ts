// /scripts/seedJobs.ts
import connectToDatabase from "@/lib/db/mongodb";
import { JobModel, IJob } from "@/lib/models/Job";
import fs from "fs";
import axios from "axios";

const FASTAPI_URL = process.env.FASTAPI_URL; // Ensure this variable is set in .env

if (!FASTAPI_URL) {
  throw new Error("FASTAPI_URL is not defined in environment variables.");
}

export async function seedJobs() {
  await connectToDatabase();

  const jobs = JSON.parse(
    fs.readFileSync("./AI/data_processing/job/jobs.json", "utf8")
  );

  for (const job of jobs) {
    if (typeof job.skillsRequired === "string") {
      job.skillsRequired = JSON.parse(job.skillsRequired.replace(/'/g, '"'));
    }

    await saveJob(job);
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

async function saveJobToFastAPI(job: any) {
  try {
    const response = await axios.post(`${FASTAPI_URL}/upsert-job`, {
      job_id: job._id.toString(),
      combined_text: job.combined_text,
      metadata: {
        title: job.title,
        industry: job.industry,
        location: job.location,
      },
    });

    console.log(`Job ${job.title} upserted:`, response.data);
  } catch (error) {
    console.error(
      `Failed to upsert job ${job.title}:`,
      error.response?.data || error.message
    );
  }
}

async function saveJob(job: any) {
  // 1. Save job to MongoDB
  const savedJob = await saveJobToMongoDB(job);

  // 2. Delegate embedding creation and upsert to FastAPI
  await saveJobToFastAPI({ ...job, _id: savedJob._id });
}
