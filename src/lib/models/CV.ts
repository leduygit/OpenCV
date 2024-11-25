// /lib/models/CV.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ICV extends Document {
  userId: mongoose.Types.ObjectId;
  filePath: string;
  fileFormat: string;
  parsedContent?: string;
  uploadedAt: Date;
}

const CVSchema: Schema = new Schema<ICV>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  filePath: { type: String, required: true },
  fileFormat: { type: String, required: true },
  parsedContent: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

export const CVModel =
  mongoose.models.CV || mongoose.model<ICV>("CV", CVSchema);
