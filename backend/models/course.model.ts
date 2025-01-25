import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  slug: string;
  creatorId: Schema.Types.ObjectId;
  collaboratorIds: Schema.Types.ObjectId[];
  description: string;
  languages: string[];
  creationDate: Date;
  lastChanged: Date;
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  creatorId: { type: Schema.Types.ObjectId, required: true },
  collaboratorIds: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  languages: [{ type: String }],
  lastChanged: { type: Date, required: true, default: new Date() },
  creationDate: { type: Date, required: true, default: new Date() },
});

const Course = model<ICourse>("Course", courseSchema);

export default Course;
