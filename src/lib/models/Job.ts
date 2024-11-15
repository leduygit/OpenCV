// /lib/models/Job.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  companyName: string;
  location: string;
  industry: string;
  salaryRange: string;
  requiredExperience: string;
  skillsRequired: string[];
  jobDescription: string;
  postedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  salaryRange: { type: String },
  requiredExperience: { type: String },
  skillsRequired: { type: [String], default: [] },
  jobDescription: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
});

export const JobModel =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
