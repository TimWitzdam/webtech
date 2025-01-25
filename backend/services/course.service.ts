import { isValidObjectId, ObjectId, Schema } from "mongoose";
import Course from "../models/course.model";
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
    description: string,
    creatorId: Schema.Types.ObjectId,
    collaboratorIds: Schema.Types.ObjectId | undefined,
    languages: string[] | undefined,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const course = new Course({
      name,
      description,
      collaboratorIds,
      languages,
      slug,
      creatorId,
    });
    const savedCourse = await course.save();
    return savedCourse === course ? (savedCourse._id as ObjectId) : undefined;
  }

  static async getAll(): Promise<Schema.Types.ObjectId[] | undefined> {
    const courses = await Course.find({});
    let courseIds: Schema.Types.ObjectId[] = [];

    courses.forEach((course) => {
      courseIds.push(course._id as Schema.Types.ObjectId);
    });

    return courseIds;
  }

  static async add(
    courseIds: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = Video.findById(videoId);
    const course = Course.findById(courseIds);
    if (!video || !course) {
      return undefined;
    }

    const courseVideo = new CourseVideo({
      videoId,
      courseIds,
    });
    const savedCourseVideo = await courseVideo.save();
    return savedCourseVideo === courseVideo
      ? (savedCourseVideo._id as ObjectId)
      : undefined;
  }

  static async join(
    courseIds: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    permission: string,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const user = await User.findById(userId);
    const course = await Course.findById(courseIds);
    if (!user || !course) {
      return undefined;
    }

    const courseUser = new CourseUser({
      userId,
      courseIds,
      permission,
    });
    const savedCourseUser = await courseUser.save();
    return savedCourseUser === courseUser
      ? (savedCourseUser._id as ObjectId)
      : undefined;
  }

  static async findById(
    videoId: Schema.Types.ObjectId,
  ): Promise<ICourseFind | undefined> {
    if (!isValidObjectId(videoId)) {
      return undefined;
    }
    const course = await Course.findById(videoId);
    if (!course) return undefined;

    const creator = await UserService.getInformation(course.creatorId);
    if (!creator) return undefined;

    const collaboratorPromises = course.collaboratorIds.map(
      async (collaborator) => {
        const user = await User.findById(collaborator);
        if (!user) return undefined;
        return {
          username: user.username,
          role: user.role,
        };
      },
    );

    const collaboratorResolved = await Promise.all(collaboratorPromises);
    const collaboratorResults = collaboratorResolved.filter(
      (collaborator): collaborator is { username: string; role: string } =>
        collaborator !== null,
    );

    return {
      _id: course._id as Schema.Types.ObjectId,
      name: course.name,
      slug: course.slug,
      description: course.description,
      languages: course.languages || [],
      collaborators: collaboratorResults || [],
      creator: {
        name: creator.username,
        role: creator.role,
      },
      creationDate: course.creationDate,
      lastChanged: course.lastChanged,
    };
  }

  static async findBySlug(slug: string): Promise<ICourseFind[] | undefined> {
    const regex = new RegExp(`${slug}`, "i");
    const courses = await Course.find({ slug: regex });
    if (!courses) {
      return undefined;
    }

    const coursePromises = courses.map(async (course) => {
      const courseDocument = await this.findById(
        course._id as Schema.Types.ObjectId,
      );
      return courseDocument;
    });
    const courseResolved = await Promise.all(coursePromises);

    const results = courseResolved.filter(
      (document): document is ICourseFind => document !== null,
    );

    return results ? results : undefined;
  }

  static async findByName(name: string): Promise<ICourseFind[] | undefined> {
    const regex = new RegExp(`${name}`, "i");
    const courses = await Course.find({ name: regex });
    if (!courses) {
      return undefined;
    }

    const coursePromises = courses.map(async (course) => {
      const courseDocument = await this.findById(
        course._id as Schema.Types.ObjectId,
      );
      return courseDocument;
    });
    const courseResolved = await Promise.all(coursePromises);

    const results = courseResolved.filter(
      (document): document is ICourseFind => document !== null,
    );

    return results ? results : undefined;
  }
}
