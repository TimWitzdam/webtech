import { Schema } from "mongoose";

export interface ICourseFind {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  collaborators: { username: string; role: string }[];
  languages: string[];
  creator: {
    username: string;
    realName: string;
    role: string;
  };
  creationDate: Date;
  lastChanged: Date;
}
