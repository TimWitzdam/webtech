import { Schema } from "mongoose";

export interface ICourseUserReturn {
  _id: Schema.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  emoji: string;
  collaborators: { username: string; role: string }[];
  languages: string[];
  creator: {
    name: string;
    role: string;
  };
  creationDate: Date;
  lastChanged: Date;
  progress: { current: number; total: number };
}
