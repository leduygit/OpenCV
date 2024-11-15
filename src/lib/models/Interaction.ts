// /lib/models/Interaction.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  interactionType: "viewed" | "saved" | "applied" | "noted";
  notes?: string;
  interactionTime: Date;
}

const InteractionSchema: Schema = new Schema<IInteraction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  interactionType: {
    type: String,
    enum: ["viewed", "saved", "applied", "noted"],
    required: true,
  },
  notes: { type: String },
  interactionTime: { type: Date, default: Date.now },
});

export const InteractionModel =
  mongoose.models.Interaction ||
  mongoose.model<IInteraction>("Interaction", InteractionSchema);
