import { Schema } from "mongoose";

export interface IFormattedNotification {
  _id: Schema.Types.ObjectId;
  title: string;
  text: string;
  link: string;
  createdAt: Date;
  read: boolean;
}
