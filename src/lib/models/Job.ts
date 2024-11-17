// /lib/models/Job.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  companyName: string;
  imageURL: string;
  salaryRange: string;
  industry: string;
  position: string;
  location: string;
  requiredExperience: string;
  requiredDegree: string;
  requirementContext: string;
  jobDescription: string;
  skillsRequired: string[];
  postedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  imageURL: { type: String, required: false },
  salaryRange: { type: String },
  industry: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  requiredExperience: { type: String },
  requiredDegree: { type: String },
  requirementContext: { type: String },
  jobDescription: { type: String, required: false },
  skillsRequired: { type: [String], default: [] },
  postedAt: { type: Date, default: Date.now },
});

export const JobModel =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
