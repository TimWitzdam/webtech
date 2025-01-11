import { Schema } from "mongoose";

export interface ICourseUserReturn {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  creator: {
    username: string;
    role: string;
  };
  creation_date: Date;
}
