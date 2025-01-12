import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  timestamp: Number;
  text: string;
}

const commentSchema = new Schema<IComment>({
  timestamp: { type: Number, required: true, default: new Date() },
  text: { type: String, required: true },
});

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
