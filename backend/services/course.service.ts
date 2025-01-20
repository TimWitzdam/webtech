import { ObjectId, Schema } from "mongoose";
import Course, { ICourse } from "../models/course.model";
import CourseVideo from "../models/course-video.model";
import Video from "../models/video.model";
import User from "../models/user.model";
import CourseUser from "../models/course-user.model";
import { ICourseFind } from "../types/CourseFind";
import { UserService } from "./user.service";

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

  static async find(name: string): Promise<ICourseFind[] | undefined> {
    const regex = new RegExp(`${name}`, "i");
    const course = await Course.find({ name: regex });
    if (!course) return undefined;
    const coursePromises = course.map(async (course) => {
      const creator = await UserService.getInformation(course.creator_id);
      if (!creator) return undefined;
      return {
        _id: course._id,
        name: course.name,
        slug: course.slug,
        creator: {
          name: creator.username,
          role: creator.role,
        },
        creation_date: course.creation_date,
      };
    });
    const courseResolve = await Promise.all(coursePromises);
    const courseResults = courseResolve.filter(
      (course): course is ICourseFind => course !== null,
    );
    return courseResults;
  }
}
