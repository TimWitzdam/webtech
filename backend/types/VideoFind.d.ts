import { Schema } from "mongoose";

export interface IVideoFind {
  _id: Schema.Types.ObjectId;
  title: string;
  length: number;
  uploader: {
    username: string;
    role: string;
  };
  creation_date: Date;
}
