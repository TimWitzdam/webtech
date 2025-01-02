import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  name: string,
  slug: string,
  creator_id: Document
  creation_date: Date
}

const courseSchema = new Schema<ICourse>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  creator_id: { type: Document, required: true },
  creation_date: { type: Date, required: true }
});

const Course = model<ICourse>("Course", courseSchema);

export default Course;
