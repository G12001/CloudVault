import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  key: string;
  size: number;
  url: string;
  folderId: string | null;
  userId: string;
}

const FileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    folderId: { type: String, default: null },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.File || mongoose.model<IFile>("File", FileSchema);
