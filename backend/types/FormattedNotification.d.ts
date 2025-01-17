import { Schema } from "mongoose";

export interface IFormattedNotification {
  _id: Schema.Types.ObjectId;
  text: string;
  date: Date;
}
