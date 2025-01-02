import { Schema, model, Document } from "mongoose";

export interface ICourseVideo extends Document {
  video_id: Document,
  course_id: Document
}

const courseVideoSchema = new Schema<ICourseVideo>({
  video_id: {type: Document, required: true},
  course_id: {type: Document, required: true}
});

const CourseVideo = model<ICourseVideo>("CourseVideo", courseVideoSchema);

export default CourseVideo ;
