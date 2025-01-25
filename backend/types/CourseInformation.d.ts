import { Schema } from "mongoose";

export interface ICourseInformation {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  creationDate: Date;
  creator: {
    username: string;
    realName: string;
    role: string;
  };
}
