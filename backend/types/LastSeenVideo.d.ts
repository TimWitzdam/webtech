import { Schema } from "mongoose";

export interface ILastSeenVideo {
  video: {
    _id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    url: string;
    length: number;
    creation_date: Date;
  };
  last_seen: Date;
  progress: number;
}
