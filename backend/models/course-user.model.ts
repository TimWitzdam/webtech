import { Schema, model, Document } from "mongoose";
import { ROLES } from "../configs/app.config";

export interface ICourseUser extends Document {
  courseId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  permission: string;
}

const courseUserSchema = new Schema<ICourseUser>({
  courseId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  permission: { type: String, required: true, enum: ROLES },
});

const CourseUser = model<ICourseUser>("CourseUser", courseUserSchema);

export default CourseUser;
