import { Schema, model, Document } from "mongoose";

export interface ICourseVideo extends Document {
  videoId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
}

const courseVideoSchema = new Schema<ICourseVideo>({
  videoId: { type: Schema.Types.ObjectId, required: true },
  courseId: { type: Schema.Types.ObjectId, required: true },
});

const CourseVideo = model<ICourseVideo>("CourseVideo", courseVideoSchema);

export default CourseVideo;
