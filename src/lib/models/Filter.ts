// /lib/models/Filter.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFilter extends Document {
  userId: mongoose.Types.ObjectId;
  filterName: string;
  criteria: {
    location?: string;
    industry?: string;
    salaryRange?: string;
    experienceLevel?: string;
    skills?: string[];
  };
  createdAt: Date;
}

const FilterSchema: Schema<IFilter> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  filterName: {
    type: String,
    required: true,
    trim: true,
  },
  criteria: {
    location: String,
    industry: String,
    salaryRange: String,
    experienceLevel: String,
    skills: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FilterModel =
  mongoose.models.Filter || mongoose.model<IFilter>("Filter", FilterSchema);
