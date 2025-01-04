import { Schema, model, Document } from "mongoose";

export interface ICourseVideo extends Document {
  video_id: Schema.Types.ObjectId;
  course_id: Schema.Types.ObjectId;
}

const courseVideoSchema = new Schema<ICourseVideo>({
  video_id: { type: Schema.Types.ObjectId, required: true },
  course_id: { type: Schema.Types.ObjectId, required: true },
});

const CourseVideo = model<ICourseVideo>("CourseVideo", courseVideoSchema);

export default CourseVideo;
