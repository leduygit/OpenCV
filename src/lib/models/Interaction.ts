// /lib/models/Interaction.ts
import mongoose, { Document, Schema } from "mongoose";

export type InteractionType = "viewed" | "saved" | "applied";

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  interactionType: InteractionType;
  notes?: string;
  createdAt: Date;
}

const InteractionSchema: Schema<IInteraction> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    index: true,
  },
  interactionType: {
    type: String,
    enum: ["viewed", "saved", "applied"],
    required: true,
    index: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Unique index to prevent duplicate interactions of the same type
InteractionSchema.index(
  { userId: 1, jobId: 1, interactionType: 1 },
  { unique: true }
);

export const InteractionModel =
  mongoose.models.Interaction ||
  mongoose.model<IInteraction>("Interaction", InteractionSchema);
