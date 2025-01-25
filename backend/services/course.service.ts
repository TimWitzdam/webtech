import { isValidObjectId, ObjectId, Schema } from "mongoose";
import Course from "../models/course.model";
import CourseVideo from "../models/course-video.model";
import Video from "../models/video.model";
import User from "../models/user.model";
import CourseUser from "../models/course-user.model";
import { ICourseFind } from "../types/CourseFind";
import { UserService } from "./user.service";
import { IVideoFind } from "../types/VideoFind";

export class CourseService {
  static async create(
    name: string,
    slug: string,
    emoji: string,
    description: string,
    creatorId: Schema.Types.ObjectId,
    collaboratorIds: Schema.Types.ObjectId | null,
    languages: string[] | null,
  ): Promise<Schema.Types.ObjectId | null> {
    const course = new Course({
      name,
      description,
      emoji,
      collaboratorIds,
      languages,
      slug,
      creatorId,
    });
    const savedCourse = await course.save();
    return savedCourse === course ? (savedCourse._id as ObjectId) : null;
  }

  static async getCourseVideos(
    userId: Schema.Types.ObjectId,
    courseId: Schema.Types.ObjectId,
  ): Promise<IVideoFind[] | null> {
    const courseVideos = await CourseVideo.find({ courseId });

    const videoPromises = courseVideos.map(async (courseVideo) => {
      const video = await Video.findById(courseVideo.videoId);
      if (!video) return null;
      const creator = await UserService.getInformation(video.uploaderId);
      if (!creator) return null;
      const userVideo = await UserService.checkIfSeen(
        userId as Schema.Types.ObjectId,
        video._id as string,
      );
      return {
        _id: video._id,
        title: video.title,
        length: video.length,
        uploader: {
          username: creator.username,
          role: creator.role,
        },
        creationDate: video.creationDate,
        seen: userVideo ? userVideo : false,
      };
    });
    const resolvedVideos = await Promise.all(videoPromises);
    const videoResults = resolvedVideos.filter(
      (videos): videos is IVideoFind => videos !== null,
    );
    return videoResults;
  }

  static async add(
    courseIds: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | null> {
    const video = Video.findById(videoId);
    const course = Course.findById(courseIds);
    if (!video || !course) {
      return null;
    }

    const courseVideo = new CourseVideo({
      videoId,
      courseIds,
    });
    const savedCourseVideo = await courseVideo.save();
    return savedCourseVideo === courseVideo
      ? (savedCourseVideo._id as ObjectId)
      : null;
  }

  static async join(
    courseIds: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    permission: string,
  ): Promise<Schema.Types.ObjectId | null> {
    const user = await User.findById(userId);
    const course = await Course.findById(courseIds);
    if (!user || !course) {
      return null;
    }

    const courseUser = new CourseUser({
      userId,
      courseIds,
      permission,
    });
    const savedCourseUser = await courseUser.save();
    return savedCourseUser === courseUser
      ? (savedCourseUser._id as ObjectId)
      : null;
  }

  static async findById(
    videoId: Schema.Types.ObjectId,
  ): Promise<ICourseFind | null> {
    if (!isValidObjectId(videoId)) {
      return null;
    }
    const course = await Course.findById(videoId);
    if (!course) return null;

    const creator = await UserService.getInformation(course.creatorId);
    if (!creator) return null;

    const collaboratorPromises = course.collaboratorIds.map(
      async (collaborator) => {
        const user = await User.findById(collaborator);
        if (!user) return null;
        return {
          username: user.username,
          realName: user.realName,
          role: user.role,
        };
      },
    );

    const collaboratorResolved = await Promise.all(collaboratorPromises);
    const collaboratorResults = collaboratorResolved.filter(
      (
        collaborator,
      ): collaborator is { username: string; realName: string; role: string } =>
        collaborator !== null,
    );

    return {
      _id: course._id as Schema.Types.ObjectId,
      name: course.name,
      slug: course.slug,
      emoji: course.emoji,
      description: course.description,
      languages: course.languages || [],
      collaborators: collaboratorResults || [],
      creator: {
        username: creator.username,
        realName: creator.realName,
        role: creator.role,
      },
      creationDate: course.creationDate,
      lastChanged: course.lastChanged,
    };
  }

  static async findBySlug(slug: string): Promise<ICourseFind[] | null> {
    const regex = new RegExp(`${slug}`, "i");
    const courses = await Course.find({ slug: regex });
    if (!courses) {
      return null;
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

    return results ? results : null;
  }

  static async findByName(name: string): Promise<ICourseFind[] | null> {
    const regex = new RegExp(`${name}`, "i");
    const courses = await Course.find({ name: regex });
    if (!courses) {
      return null;
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

    return results ? results : null;
  }
}
