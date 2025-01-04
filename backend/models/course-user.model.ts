import { Schema, model, Document } from "mongoose";
import { ROLES } from "../configs/app.config";

export interface ICourseUser extends Document {
  course_id: Schema.Types.ObjectId;
  permission: string;
}

const courseUserSchema = new Schema<ICourseUser>({
  course_id: { type: Schema.Types.ObjectId, required: true },
  permission: { type: String, required: true, enum: ROLES },
});

const CourseUser = model<ICourseUser>("CourseUser", courseUserSchema);

export default CourseUser;
