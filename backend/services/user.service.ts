import { Schema } from "mongoose";
import User from "../models/user.model";
import Video from "../models/video.model";
import UserVideo from "../models/user-video.model";
import { ILastSeenVideo } from "../types/LastSeenVideo";
import CourseUser from "../models/course-user.model";
import Course from "../models/course.model";
import { ICourseUserReturn } from "../types/CourseUserReturn";
import Saved from "../models/saved.model";
import bcrypt from "bcryptjs";
import Notification from "../models/notifications.model";
import { IFormattedNotification } from "../types/FormattedNotification";
import WatchLater from "../models/watch-later.model";
import { IVideoFind } from "../types/VideoFind";
import CourseVideo from "../models/course-video.model";
import { CourseService } from "./course.service";
import { ISavedVideo } from "../types/SavedVideo";

const { ObjectId } = require("mongoose").mongo;

export class UserService {
  static async createUser(
    username: string,
    password: string,
    role: string = "Student",
  ): Promise<any | null> {
    if (!role) role = "Student";

    const user = new User({
      username,
      password,
      role,
    });
    const saved_user = await user.save();
    return saved_user === user
      ? (saved_user._id as Schema.Types.ObjectId)
      : null;
  }

  static async getInformation(id: Schema.Types.ObjectId) {
    let result = await User.findById(id);
    return result ? result : null;
  }

  static async getIdByUsername(username: string) {
    let result = await User.findOne({ username });
    return result ? result._id : null;
  }

  static async getId(id: Schema.Types.ObjectId) {
    let result = await User.findById(id);
    return result ? result._id : null;
  }

  static async watch(
    videoId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    progress: number,
  ): Promise<Schema.Types.ObjectId | null> {
    const video = await Video.findById(videoId);
    const user = await User.findById(userId);
    if (!video || !user) {
      return null;
    }

    const userVideo = await UserVideo.find({ videoId, userId });
    if (!userVideo || userVideo.length > 1) {
      return null;
    }

    if (userVideo.length > 0) {
      if (progress < video.length) {
        userVideo[0].progress = progress;
      } else {
        progress = video.length;
      }
      const result = await userVideo[0].save();
      if (!result) {
        return null;
      }
      return result._id as Schema.Types.ObjectId;
    }

    const formatProgress = progress < video.length ? progress : video.length;
    const userVideoList = new UserVideo({
      videoId,
      userId,
      progress: formatProgress,
      lastSeen: new Date(),
      seen: false,
    });
    const savedUserVideo = await userVideoList.save();
    return savedUserVideo === userVideoList
      ? (savedUserVideo._id as Schema.Types.ObjectId)
      : null;
  }

  static async getLatestVideos(
    userId: Schema.Types.ObjectId,
  ): Promise<ILastSeenVideo[] | null> {
    let latestVideoDocuments = await UserVideo.find({
      userId,
      seen: false,
    });
    let latestVideos: ILastSeenVideo[] = [];

    if (!latestVideoDocuments) return null;

    const videoPromises = latestVideoDocuments.map(async (userVideoList) => {
      const video = await Video.findById(userVideoList.videoId);
      const courseVideos = await CourseVideo.find({
        videoId: userVideoList.videoId,
      });

      if (!video || !courseVideos) {
        return null;
      }

      const coursePromises = courseVideos.map(async (courseVideo) => {
        const course = await Course.findById(courseVideo.courseId);
        if (!course) return null;
        return {
          _id: course._id,
          name: course.name,
          slug: course.slug,
        };
      });
      const resolvedPromises = await Promise.all(coursePromises);
      const courseResults = resolvedPromises.filter(
        (
          course,
        ): course is {
          _id: Schema.Types.ObjectId;
          name: string;
          slug: string;
        } => course !== null,
      );

      return {
        video: {
          _id: video._id as Schema.Types.ObjectId,
          title: video.title,
          length: video.length,
          creationDate: video.creationDate,
        },
        lastSeen: userVideoList.lastSeen,
        progress: (userVideoList.progress / video.length) * 100,
        foundIn: courseResults,
      };
    });

    const videoResults = await Promise.all(videoPromises);

    latestVideos = videoResults.filter(
      (video): video is ILastSeenVideo => video !== null,
    );

    return latestVideos ? latestVideos : null;
  }

  static async getUserCourses(
    userId: Schema.Types.ObjectId,
  ): Promise<ICourseUserReturn[] | null> {
    const userCourseDocuments = await CourseUser.find({ userId });

    if (!userCourseDocuments) return null;

    const courseDocumentPromises = userCourseDocuments.map(
      async (courseDocument) => {
        if (courseDocument) {
          const course = await Course.findById(courseDocument.courseId);
          if (!course) return null;
          const creator = await User.findById(course.creatorId);
          if (!creator) return null;

          const collaboratorPromises = course.collaboratorIds.map(
            async (collaborator) => {
              const user = await User.findById(collaborator);
              if (!user) return null;
              return {
                username: user.username,
                role: user.role,
              };
            },
          );

          const collaboratorResolved = await Promise.all(collaboratorPromises);
          const collaboratorResults = collaboratorResolved.filter(
            (
              collaborator,
            ): collaborator is { username: string; role: string } =>
              collaborator !== null,
          );

          const courseVideos = await CourseService.getCourseVideos(
            new ObjectId(userId),
            new ObjectId(courseDocument.courseId),
          );
          let progress: { current: number; total: number };
          if (courseVideos) {
            const current = courseVideos.filter((courseVideo) =>
              courseVideo.seen ? true : null,
            );
            progress = { current: current.length, total: courseVideos.length };
          } else {
            progress = { current: 0, total: 0 };
          }

          return {
            _id: course._id as Schema.Types.ObjectId,
            name: course.name,
            slug: course.slug,
            description: course.description,
            emoji: course.emoji,
            languages: course.languages || [],
            collaborators: collaboratorResults || [],
            creator: {
              name: creator.username,
              role: creator.role,
            },
            creationDate: course.creationDate,
            lastChanged: course.lastChanged,
            progress: progress,
          };
        }
        return null;
      },
    );
    let userCourseResults = await Promise.all(courseDocumentPromises);

    if (!userCourseResults) return null;

    const result = userCourseResults.filter(
      (course): course is ICourseUserReturn => course !== null,
    );

    return result ? result : null;
  }

  static async saveVideo(
    userId: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | boolean | null> {
    const alreadySaved = await Saved.find({ userId, videoId });
    if (alreadySaved.length > 0) {
      const result = await Saved.deleteOne({ userId, videoId });
      return result.acknowledged;
    }

    const newSavedVideo = new Saved({ userId, videoId });
    const savedVideo = await newSavedVideo.save();
    return savedVideo ? (savedVideo._id as Schema.Types.ObjectId) : null;
  }

  static async getSavedVideos(
    userId: Schema.Types.ObjectId,
  ): Promise<ISavedVideo[] | null> {
    const savedVideoDocuments = await Saved.find({ userId });
    if (!savedVideoDocuments) return null;

    const savedVideoPromises = savedVideoDocuments.map(async (saved) => {
      const video = await Video.findById(saved.videoId);
      const courseVideos = await CourseVideo.find({
        videoId: saved.videoId,
      });

      if (!video || !courseVideos) {
        return null;
      }

      const coursePromises = courseVideos.map(async (courseVideo) => {
        const course = await Course.findById(courseVideo.courseId);
        if (!course) return null;
        return {
          _id: course._id,
          name: course.name,
          slug: course.slug,
          emoji: course.emoji,
        };
      });
      const resolvedPromises = await Promise.all(coursePromises);
      const courseResults = resolvedPromises.filter(
        (
          course,
        ): course is {
          _id: Schema.Types.ObjectId;
          name: string;
          slug: string;
          emoji: string;
        } => course !== null,
      );

      const userVideo = await UserVideo.find({
        userId,
        videoId: saved.videoId,
      });
      const seen = await this.checkIfSeen(userId, saved.videoId.toString());

      if (!userVideo || userVideo.length === 0) {
        return {
          video: {
            _id: video._id as Schema.Types.ObjectId,
            title: video.title,
            length: video.length,
            creationDate: video.creationDate,
          },
          lastSeen: new Date(),
          progress: 0,
          foundIn: courseResults,
          seen: seen ? seen : false,
        };
      }

      return {
        video: {
          _id: video._id as Schema.Types.ObjectId,
          title: video.title,
          length: video.length,
          creationDate: video.creationDate,
        },
        lastSeen: userVideo[0].lastSeen,
        progress: (userVideo[0].progress / video.length) * 100,
        foundIn: courseResults,
        seen: seen ? seen : false,
      };
    });

    const savedVideoResults = await Promise.all(savedVideoPromises);
    const result = savedVideoResults.filter(
      (video): video is ISavedVideo => video !== null,
    );

    return result ? result : null;
  }

  static async changePassword(
    id: Schema.Types.ObjectId,
    old_password: string,
    new_password: string,
  ): Promise<boolean | null> {
    const user = await User.findById(id);
    if (!user) {
      return false;
    }
    const password_result = await bcrypt.compare(old_password, user.password);
    if (!password_result) {
      return false;
    }

    const hash = await bcrypt.hash(new_password, 10);
    user.password = hash;
    const result = await user.save();

    if (!result) {
      return false;
    }

    return true;
  }

  static async getNotifications(
    userId: Schema.Types.ObjectId,
  ): Promise<IFormattedNotification[] | null> {
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    if (!notifications) return null;

    const formatted = notifications.map((notification) => {
      return {
        _id: notification._id as Schema.Types.ObjectId,
        title: notification.title,
        text: notification.text,
        link: notification.link,
        createdAt: notification.createdAt,
        read: notification.read,
      };
    });
    if (!formatted) return null;
    const formattedResults = formatted.filter(
      (notification): notification is IFormattedNotification =>
        notification !== null,
    );

    return formattedResults;
  }

  static async markAsSeen(
    userId: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | null> {
    const userVideoList = await UserVideo.find({
      $and: [{ userId: userId }, { videoId: videoId }],
    });

    if (!userVideoList) {
      return null;
    }
    if (userVideoList.length > 1 || userVideoList.length === 0) {
      return null;
    }

    const userVideo = userVideoList[0];
    userVideo.seen = true;
    const result = await userVideo.save();
    if (!result) {
      return null;
    }

    return result._id as Schema.Types.ObjectId;
  }

  static async checkIfSeen(
    userId: Schema.Types.ObjectId,
    videoId: string,
  ): Promise<boolean | null> {
    const userVideoList = await UserVideo.find({
      $and: [{ userId: userId }, { videoId: videoId }],
    });

    if (!userVideoList) {
      return null;
    }
    if (userVideoList.length > 1 || userVideoList.length === 0) {
      return null;
    }

    const userVideo = userVideoList[0];
    if (!userVideo) {
      return null;
    }

    return userVideo.seen;
  }

  static async addToWatchLater(
    userId: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | null> {
    const watchLaterList = await WatchLater.find({ userId, videoId });
    if (watchLaterList.length > 0) return null;

    const watchLaterDocument = new WatchLater({ userId, videoId });
    const watchLaterResult = await watchLaterDocument.save();
    if (!watchLaterResult) {
      return null;
    }
    return watchLaterResult._id as Schema.Types.ObjectId;
  }

  static async getWatchLater(
    userId: Schema.Types.ObjectId,
  ): Promise<IVideoFind[] | null> {
    const watchLaterDocuments = await WatchLater.find({ userId: userId });
    if (!watchLaterDocuments) return null;
    const videoPromises = watchLaterDocuments.map(async (document) => {
      const video = await Video.findById(document.videoId);
      if (!video) return null;
      const creator = await UserService.getInformation(video.uploaderId);
      if (!creator) return null;
      return {
        _id: video._id,
        title: video.title,
        length: video.length,
        uploader: {
          username: creator.username,
          role: creator.role,
        },
        creationDate: video.creationDate,
      };
    });
    const resolvedVideos = await Promise.all(videoPromises);
    const videoResults = resolvedVideos.filter(
      (videos): videos is IVideoFind => videos !== null,
    );

    return videoResults ? videoResults : null;
  }
}
