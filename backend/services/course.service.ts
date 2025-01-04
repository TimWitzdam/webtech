import { ObjectId, Schema } from "mongoose";
import Course from "../models/course.model";
import CourseVideo from "../models/course-video.model";
import Video from "../models/video.model";
import User from "../models/user.model";
import CourseUser from "../models/course-user.model";
import { logger } from "../configs/app.config";

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

  static async add(
    course_id: Schema.Types.ObjectId,
    video_id: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = Video.findById(video_id);
    const course = Course.findById(course_id);
    if (!video || !course) {
      return undefined;
    }

    const courseVideo = new CourseVideo({
      video_id,
      course_id,
    });
    const savedCourseVideo = await courseVideo.save();
    return savedCourseVideo === courseVideo
      ? (savedCourseVideo._id as ObjectId)
      : undefined;
  }

  static async join(
    course_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    permission: string,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const user = await User.findById(user_id);
    const course = await Course.findById(course_id);
    if (!user || !course) {
      return undefined;
    }

    const courseUser = new CourseUser({
      user_id,
      course_id,
      permission,
    });
    const savedCourseUser = await courseUser.save();
    return savedCourseUser === courseUser
      ? (savedCourseUser._id as ObjectId)
      : undefined;
  }
}
