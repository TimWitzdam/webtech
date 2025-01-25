import { isValidObjectId, Schema } from "mongoose";
import Video, { IVideo } from "../models/video.model";
import Comment from "../models/comment.model";
import VideoComment from "../models/video-comment.model";
import User from "../models/user.model";
import { UserService } from "./user.service";
import { IVideoFind } from "../types/VideoFind";
import Course from "../models/course.model";
import CourseVideo from "../models/course-video.model";
import { ICourseInformation } from "../types/CourseInformation";
import { IFormattedComment } from "../types/FormattedComment";

export class VideoService {
  static async create(
    title: string,
    length: number,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = new Video({
      title,
      length,
      creationId: new Date(),
    });
    const saved_video = await video.save();
    return saved_video === video
      ? (saved_video._id as Schema.Types.ObjectId)
      : undefined;
  }

  /* TODO:
   *
   * Add middleware too check if user is part of course
   *
   */

  static async createComment(
    userId: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
    text: string,
    timestamp: number,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const comment = new Comment({
      text,
      timestamp,
    });
    const savedComment = await comment.save();
    if (!savedComment) return undefined;

    const videoComment = new VideoComment({
      userId,
      videoId,
      commentId: savedComment._id,
    });
    const savedVideoComment = await videoComment.save();
    return savedVideoComment
      ? (savedVideoComment._id as Schema.Types.ObjectId)
      : undefined;
  }

  static async getComments(
    videoId: string,
  ): Promise<IFormattedComment[] | undefined> {
    const videoComments = await VideoComment.find({ videoId });
    if (!videoComments) return undefined;

    const commentPromises = videoComments.map(async (videoComment) => {
      let comment = await Comment.findById(videoComment.commentId);
      let user = await User.findById(videoComment.userId);
      if (!comment || !user) return undefined;
      return {
        username: user.username,
        role: user.role,
        text: comment.text,
        createdAt: comment.createdAt,
        likes: comment.likes,
      };
    });

    const resolvedPromises = await Promise.all(commentPromises);
    const comments = resolvedPromises.filter(
      (comment): comment is IFormattedComment => comment !== null,
    );
    if (!comments) return undefined;
    return comments;
  }

  static async getInformation(videoId: string): Promise<IVideo | undefined> {
    if (!isValidObjectId(videoId)) {
      return undefined;
    }
    const video = await Video.findById(videoId);
    if (!video) return undefined;
    return video;
  }

  static async getCourses(
    videoId: string,
  ): Promise<ICourseInformation[] | undefined> {
    if (!isValidObjectId(videoId)) {
      return undefined;
    }

    const courseVideos = await CourseVideo.find({ videoId });
    const coursePromises = courseVideos.map(async (courseVideo) => {
      if (!courseVideo) return undefined;
      const course = await Course.findById(courseVideo.courseId);
      if (!course) return undefined;
      const user = await User.findById(course.creatorId);
      if (!user) return undefined;
      return {
        _id: course._id,
        name: course.name,
        slug: course.slug,
        creationDate: course.creationDate,
        creator: {
          username: user.username,
          role: user.role,
        },
      };
    });
    const resolvedPromises = await Promise.all(coursePromises);
    const result = resolvedPromises.filter(
      (course): course is ICourseInformation => course !== null,
    );
    if (!result) return undefined;
    return result;
  }

  static async find(name: string): Promise<IVideoFind[] | undefined> {
    const regex = new RegExp(`${name}`, "i");
    const videos = await Video.find({ title: regex });
    const videoPromises = videos.map(async (video) => {
      const creator = await UserService.getInformation(video.uploaderId);
      if (!creator) return undefined;
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
    if (!videoResults) return undefined;
    return videoResults;
  }
}
