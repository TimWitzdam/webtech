import { Schema } from "mongoose";

export interface ICourseInformation {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  creation_date: Date;
  creator: {
    username: string;
    role: string;
  };
}
