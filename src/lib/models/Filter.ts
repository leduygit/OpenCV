// /lib/models/Filter.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFilter extends Document {
  userId: mongoose.Types.ObjectId;
  filterName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterCriteria: Record<string, any>;
  createdAt: Date;
  lastUsedAt: Date;
}

const FilterSchema: Schema = new Schema<IFilter>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  filterName: { type: String, required: true },
  filterCriteria: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date, default: Date.now },
});

export const FilterModel =
  mongoose.models.Filter || mongoose.model<IFilter>("Filter", FilterSchema);
