import { Schema } from "mongoose";

export interface IFormattedComment {
  id: Schema.Types.ObjectId;
  username: string;
  role: string;
  text: string;
  createdAt: Date;
  likes: number;
}
