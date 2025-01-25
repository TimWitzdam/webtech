import { Schema } from "mongoose";

export interface ILastSeenVideo {
  course: {
    _id: Schema.Types.ObjectId;
    name: string;
    slug: string;
    creator: {
      username: string;
      realName: string;
      role: string;
    };
    creation_date: Date;
  };
}
