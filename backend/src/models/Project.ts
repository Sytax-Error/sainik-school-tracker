import mongoose, { type Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  code: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
