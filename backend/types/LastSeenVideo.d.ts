import { Schema } from "mongoose";

export interface ILastSeenVideo {
  video: {
    _id: Schema.Types.ObjectId;
    title: string;
    slug: string;
    url: string;
    length: number;
    creationDate: Date;
  };
  lastSeen: Date;
  progress: number;
  foundIn: {
    _id: Schema.Types.ObjectId;
    name: string;
    slug: string;
    emoji: string;
  }[];
}
