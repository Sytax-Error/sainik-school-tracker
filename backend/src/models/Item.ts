import mongoose, { type Document, Schema } from "mongoose";

export type ItemStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface IItem extends Document {
  projectId: mongoose.Types.ObjectId;
  phaseId: mongoose.Types.ObjectId;
  code: string;
  name: string;
  description?: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  status: ItemStatus;
  progressPercent: number;
  valueCompleted: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    phaseId: {
      type: Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
      index: true,
    },
    code: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    unit: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"],
      default: "NOT_STARTED",
      index: true,
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    valueCompleted: { type: Number, default: 0, min: 0 },
    remarks: { type: String, trim: true },
  },
  { timestamps: true },
);

itemSchema.index({ projectId: 1, phaseId: 1, code: 1 }, { unique: true });
itemSchema.index({ projectId: 1, status: 1 });

export const Item = mongoose.model<IItem>("Item", itemSchema);
export const ITEM_STATUSES: ItemStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
];
