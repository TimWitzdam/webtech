import { ObjectId, Schema } from "mongoose";
import Course from "../models/course.model";

export class CourseService {
  static async create(
    name: string,
    slug: string,
    creator_id: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const course = new Course({
      name,
      slug,
      creator_id,
      creation_date: new Date(),
    });
    const saved_course = await course.save();
    return saved_course === course ? (saved_course._id as ObjectId) : undefined;
  }

  static async getAll(): Promise<Schema.Types.ObjectId[] | undefined> {
    const courses = await Course.find({});
    let course_ids: Schema.Types.ObjectId[] = [];

    courses.forEach((course) => {
      course_ids.push(course._id as Schema.Types.ObjectId);
    });

    return course_ids;
  }
}
