// src/models/CV.ts

import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICV extends Document {
  userId: mongoose.Types.ObjectId;
  content: string; // Nội dung đầy đủ của CV
  embedding: number[]; // Embedding vector hóa
  createdAt: Date;
}

const CVSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  }, // Liên kết với User
  content: { type: String, required: true }, // Nội dung CV
  embedding: [{ type: Number, required: true }], // Embedding vector
  createdAt: { type: Date, default: Date.now },
});

export const CV: Model<ICV> =
  mongoose.models.CV || mongoose.model<ICV>("CV", CVSchema);
export default CV;
