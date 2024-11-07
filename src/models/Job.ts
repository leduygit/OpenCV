// src/models/Job.ts

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  image_url: string;
  salary: string;
  industry: string;
  position: string;
  location: string;
  requirements: string[]; // Các yêu cầu công việc
  embedding: number[]; // Embedding vector hóa
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true }, // Validation cho title
  company: { type: String, required: true }, // Tên công ty
  image_url: { type: String }, // URL logo của công ty
  salary: { type: String, required: true }, // Lưu chuỗi mức lương
  industry: { type: String, required: true }, // Ngành nghề
  position: { type: String, required: true }, // Vị trí công việc
  location: { type: String, required: true }, // Địa điểm làm việc
  requirements: [{ type: String, required: true }], // Các yêu cầu (kỹ năng)
  embedding: [{ type: Number, required: true }], // Embedding vector
  createdAt: { type: Date, default: Date.now },
});

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
