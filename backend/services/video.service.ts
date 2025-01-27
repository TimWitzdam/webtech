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
import UserVideo, { IUserVideo } from "../models/user-video.model";
import VideoLike from "../models/comment-like.model";
import CommentLike from "../models/comment-like.model";
import CommentAnswer, { ICommentAnswer } from "../models/comment-answer.model";
import { IVideoComments } from "../types/VideoComments";
import CommentReport from "../models/comment-report.model";

export class VideoService {
  static async create(
    title: string,
    length: number,
  ): Promise<Schema.Types.ObjectId | null> {
    const video = new Video({
      title,
      length,
      creationId: new Date(),
    });
    const saved_video = await video.save();
    return saved_video === video
      ? (saved_video._id as Schema.Types.ObjectId)
      : null;
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
  ): Promise<Schema.Types.ObjectId | null> {
    const comment = new Comment({
      text,
    });
    const savedComment = await comment.save();
    if (!savedComment) return null;

    const videoComment = new VideoComment({
      userId,
      videoId,
      commentId: savedComment._id,
    });
    const savedVideoComment = await videoComment.save();
    return savedVideoComment
      ? (savedVideoComment._id as Schema.Types.ObjectId)
      : null;
  }

  // alle subcomments holen IVideoComments ist ein extend von IFormattedComment
  static async getComments(videoId: string): Promise<IVideoComments[] | null> {
    const videoComments = await VideoComment.find({ videoId });
    if (!videoComments) return null;

    const commentPromises = videoComments.map(async (videoComment) => {
      let comment = await Comment.findById(videoComment.commentId);
      let user = await User.findById(videoComment.userId);
      if (!comment || !user) return null;

      const answerIds = await CommentAnswer.find({
        parentCommentId: comment._id,
      });
      const answerCommentPromises = answerIds.map(
        async (
          answerComment: ICommentAnswer,
        ): Promise<IFormattedComment | null> => {
          const comment = await Comment.findById(
            answerComment.childrenCommentId,
          );
          const user = await User.findById(answerComment.userId);
          if (!comment || !user) return null;

          return {
            id: comment._id as Schema.Types.ObjectId,
            username: user.username,
            role: user.role,
            text: comment.text,
            createdAt: comment.createdAt,
            likes: comment.likes,
          };
        },
      );
      const answerCommentDocuments = await Promise.all(answerCommentPromises);
      const answers = answerCommentDocuments.filter(
        (comment): comment is IFormattedComment => comment !== null,
      );

      return {
        id: comment._id,
        username: user.username,
        role: user.role,
        text: comment.text,
        createdAt: comment.createdAt,
        likes: comment.likes,
        answers: answers,
      };
    });

    const resolvedPromises = await Promise.all(commentPromises);
    const comments = resolvedPromises.filter(
      (comment): comment is IVideoComments => comment !== null,
    );
    if (!comments) return null;
    return comments;
  }

  static async getUserData(
    userId: Schema.Types.ObjectId,
    videoId: Schema.Types.ObjectId,
  ): Promise<IUserVideo | null> {
    const userVideo = await UserVideo.find({ userId, videoId });
    if (!userVideo || userVideo.length === 0) {
      return null;
    }
    return userVideo[0];
  }

  static async getInformation(videoId: string): Promise<IVideo | null> {
    if (!isValidObjectId(videoId)) {
      return null;
    }
    const video = await Video.findById(videoId);
    if (!video) return null;
    return video;
  }

  static async getCourses(
    videoId: string,
  ): Promise<ICourseInformation[] | null> {
    if (!isValidObjectId(videoId)) {
      return null;
    }

    const courseVideos = await CourseVideo.find({ videoId });
    const coursePromises = courseVideos.map(async (courseVideo) => {
      if (!courseVideo) return null;
      const course = await Course.findById(courseVideo.courseId);
      if (!course) return null;
      const user = await User.findById(course.creatorId);
      if (!user) return null;
      return {
        _id: course._id,
        name: course.name,
        slug: course.slug,
        emoji: course.emoji,
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
    if (!result) return null;
    return result;
  }

  static async find(name: string): Promise<IVideoFind[] | null> {
    const regex = new RegExp(`${name}`, "i");
    const videos = await Video.find({ title: regex });
    const videoPromises = videos.map(async (video) => {
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
    if (!videoResults) return null;
    return videoResults;
  }

  static async checkIfLiked(
    userId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
  ): Promise<boolean | null> {
    const videoLike = await CommentLike.find({ userId, commentId });
    if (!videoLike || videoLike.length === 0) {
      return false;
    }
    return true;
  }

  static async checkIfReported(
    userId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
  ): Promise<boolean | null> {
    const videoReport = await CommentReport.find({ userId, commentId });
    if (!videoReport || videoReport.length === 0) {
      return false;
    }
    return true;
  }

  static async likeComment(
    userId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | null> {
    const newVideoLike = new CommentLike({ userId, commentId });
    const videoLikeDocument = await newVideoLike.save();
    if (!videoLikeDocument) {
      return null;
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return null;
    }
    comment.likes = comment.likes + 1;
    const newCommentDocument = await comment.save();
    if (!newCommentDocument) {
      return null;
    }

    return videoLikeDocument._id as Schema.Types.ObjectId;
  }

  static async reportComment(
    userId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
  ): Promise<Schema.Types.ObjectId | null> {
    const newReport = new CommentReport({ userId, commentId });
    const videoReportDocument = await newReport.save();
    if (!videoReportDocument) {
      return null;
    }

    return videoReportDocument._id as Schema.Types.ObjectId;
  }

  static async answerComment(
    userId: Schema.Types.ObjectId,
    commentId: Schema.Types.ObjectId,
    text: string,
  ): Promise<Schema.Types.ObjectId | null> {
    const newComment = new Comment({ text });
    const commentDocument = await newComment.save();
    if (!commentDocument) {
      return null;
    }
    const newAnswer = new CommentAnswer({
      parentCommentId: commentId,
      childrenCommentId: commentDocument._id,
      userId,
    });
    const answerDocument = await newAnswer.save();
    if (!answerDocument) {
      return null;
    }
    return answerDocument._id as Schema.Types.ObjectId;
  }
}
