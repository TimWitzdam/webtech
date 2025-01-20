import { Schema } from "mongoose";

export interface ICourseFind {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  creator: {
    name: string;
    role: string;
  };
  creation_date: Date;
}
