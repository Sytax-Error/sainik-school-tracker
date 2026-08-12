import mongoose, { type Document, Schema } from "mongoose";

export interface IPhase extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  order: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new Schema<IPhase>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    order: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

phaseSchema.index({ projectId: 1, code: 1 }, { unique: true });
phaseSchema.index({ projectId: 1, order: 1 });

export const Phase = mongoose.model<IPhase>("Phase", phaseSchema);
