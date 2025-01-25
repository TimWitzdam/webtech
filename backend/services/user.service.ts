import { Schema } from "mongoose";
import User from "../models/user.model";
import Video, { IVideo } from "../models/video.model";
import UserVideo from "../models/user-video.model";
import { ILastSeenVideo } from "../types/LastSeenVideo";
import CourseUser from "../models/course-user.model";
import Course from "../models/course.model";
import { ICourseUserReturn } from "../types/CourseUserReturn";
import Saved from "../models/saved.model";
import bcrypt from "bcryptjs";
import Notification from "../models/notifications.model";
import { IFormattedNotification } from "../types/FormattedNotification";

export class UserService {
  static async createUser(
    username: string,
    password: string,
    role: string = "Student",
  ): Promise<any | undefined> {
    if (!role) role = "Student";

    const user = new User({
      username,
      password,
      role,
    });
    const saved_user = await user.save();
    return saved_user === user
      ? (saved_user._id as Schema.Types.ObjectId)
      : undefined;
  }

  static async getInformation(id: Schema.Types.ObjectId) {
    let result = await User.findById(id);
    return result ? result : undefined;
  }

  static async getIdByUsername(username: string) {
    let result = await User.findOne({ username });
    return result ? result._id : undefined;
  }

  static async getId(id: Schema.Types.ObjectId) {
    let result = await User.findById(id);
    return result ? result._id : undefined;
  }

  static async watch(
    videoId: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    progress: number,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = await Video.findById(videoId);
    const user = await User.findById(user_id);
    if (!video || !user) {
      return undefined;
    }

    const userVideo = await UserVideo.find({ videoId, user_id });
    if (!userVideo || userVideo.length > 1) {
      return undefined;
    }

    if (userVideo.length > 0) {
      if (progress < video.length) {
        userVideo[0].progress = progress;
      } else {
        progress = video.length;
      }
      const result = await userVideo[0].save();
      if (!result) {
        return undefined;
      }
      return result._id as Schema.Types.ObjectId;
    }

    const formatProgress = progress < video.length ? progress : video.length;
    const userVideoList = new UserVideo({
      videoId,
      user_id,
      progress: formatProgress,
      lastSeen: new Date(),
    });
    const savedUserVideo = await userVideoList.save();
    return savedUserVideo === userVideoList
      ? (savedUserVideo._id as Schema.Types.ObjectId)
      : undefined;
  }

  static async getLatestVideos(
    user_id: Schema.Types.ObjectId,
  ): Promise<ILastSeenVideo[] | undefined> {
    let latestVideoDocuments = await UserVideo.find({ user_id, seen: false });
    let latestVideos: ILastSeenVideo[] = [];

    if (!latestVideoDocuments) return undefined;

    const videoPromises = latestVideoDocuments.map(async (userVideoList) => {
      let video = await Video.findById(userVideoList.videoId);
      if (video) {
        let tmp = {
          video: {
            _id: video._id as Schema.Types.ObjectId,
            title: video.title,
            length: video.length,
            creationDate: video.creationDate,
          },
          lastSeen: userVideoList.lastSeen,
          progress: userVideoList.progress,
        };
        return tmp;
      }
      return null;
    });

    const videoResults = await Promise.all(videoPromises);

    latestVideos = videoResults.filter(
      (video): video is ILastSeenVideo => video !== null,
    );

    return latestVideos ? latestVideos : undefined;
  }

  static async getUserCourses(
    user_id: Schema.Types.ObjectId,
  ): Promise<ICourseUserReturn[] | undefined> {
    const userCourseDocuments = await CourseUser.find({ user_id });

    if (!userCourseDocuments) return undefined;

    const courseDocumentPromises = userCourseDocuments.map(
      async (courseDocuments) => {
        if (courseDocuments) {
          const course = await Course.findById(courseDocuments.courseId);
          if (!course) return null;
          const creator = await User.findById(course.creatorId);
          if (!creator) return null;

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
            (
              collaborator,
            ): collaborator is { username: string; role: string } =>
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
        return null;
      },
    );
    let userCourseResults = await Promise.all(courseDocumentPromises);

    if (!userCourseResults) return undefined;

    const result = userCourseResults.filter(
      (course): course is ICourseUserReturn => course !== null,
    );

    return result ? result : undefined;
  }

  static async saveVideo(
    user_id: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const newSavedVideo = new Saved({ user_id, videoId });
    const savedVideo = await newSavedVideo.save();
    return savedVideo ? (savedVideo._id as Schema.Types.ObjectId) : undefined;
  }

  static async getSavedVideos(
    user_id: Schema.Types.ObjectId,
  ): Promise<IVideo[] | undefined> {
    const savedVideoDocuments = await Saved.find({ user_id });
    if (!savedVideoDocuments) return undefined;

    const savedVideoPromises = savedVideoDocuments.map(async (saved) => {
      const video = await Video.findById(saved.videoId);
      if (!video) return null;
      return {
        _id: video._id,
        title: video.title,
        length: video.length,
        creationDate: video.creationDate,
      };
    });

    const savedVideoResults = await Promise.all(savedVideoPromises);
    const result = savedVideoResults.filter(
      (video): video is IVideo => video !== null,
    );

    return result ? result : undefined;
  }

  static async changePassword(
    id: Schema.Types.ObjectId,
    old_password: string,
    new_password: string,
  ): Promise<boolean | undefined> {
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

  static async forgotPassword(
    email: string,
    password: string,
  ): Promise<boolean | undefined> {
    return;
  }

  static async getNotifications(
    user_id: Schema.Types.ObjectId,
  ): Promise<IFormattedNotification[] | undefined> {
    const notifications = await Notification.find({ user_id });
    if (!notifications) return undefined;

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
    if (!formatted) return undefined;

    return formatted;
  }

  static async markAsSeen(
    user_id: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const userVideoList = await UserVideo.find({
      $and: [{ user_id: user_id }, { videoId: videoId }],
    });

    if (!userVideoList) {
      return undefined;
    }
    if (userVideoList.length > 1 || userVideoList.length === 0) {
      return undefined;
    }

    const userVideo = userVideoList[0];
    userVideo.seen = true;
    const result = await userVideo.save();
    if (!result) {
      return undefined;
    }

    return result._id as Schema.Types.ObjectId;
  }

  static async checkIfSeen(
    user_id: Schema.Types.ObjectId,
    videoId: string,
  ): Promise<boolean | undefined> {
    const userVideoList = await UserVideo.find({
      $and: [{ user_id: user_id }, { videoId: videoId }],
    });

    if (!userVideoList) {
      return undefined;
    }
    if (userVideoList.length > 1 || userVideoList.length === 0) {
      return undefined;
    }

    const userVideo = userVideoList[0];
    if (!userVideo) {
      return undefined;
    }

    return userVideo.seen;
  }
}
