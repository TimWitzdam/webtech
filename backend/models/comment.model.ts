import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  text: string;
  likes: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: new Date() },
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
