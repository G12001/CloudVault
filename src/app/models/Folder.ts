import mongoose, { Schema, Document } from "mongoose";

export interface IFolder extends Document {
  name: string;
  parentId: string | null;
  userId: string;
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true },
    parentId: { type: String, default: null },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Folder ||
  mongoose.model<IFolder>("Folder", FolderSchema);
