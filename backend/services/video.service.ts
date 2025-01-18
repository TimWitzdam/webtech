import { isValidObjectId, Schema } from "mongoose";
import Video, { IVideo } from "../models/video.model";
import Comment from "../models/comment.model";
import VideoComment from "../models/video-comment.model";
import User from "../models/user.model";
import { IVideoComment } from "../types/VideoComment";

export class VideoService {
  static async create(
    title: string,
    slug: string,
    url: string,
    length: number,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = new Video({
      title,
      slug,
      url,
      length,
      creation_date: new Date(),
    });
    const saved_video = await video.save();
    return saved_video === video
      ? (saved_video._id as Schema.Types.ObjectId)
      : undefined;
  }

  static async getAll() {
    const videos = await Video.find({});
    let video_ids: Schema.Types.ObjectId[] = [];

    videos.forEach((video) => {
      video_ids.push(video._id as Schema.Types.ObjectId);
    });

    return video_ids;
  }

  /* TODO:
   *
   * Add middleware too check if user is part of course
   *
   */

  static async createComment(
    user_id: Schema.Types.ObjectId,
    video_id: Schema.Types.ObjectId,
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
      user_id,
      video_id,
      comment_id: savedComment._id,
    });
    const savedVideoComment = await videoComment.save();
    return savedVideoComment
      ? (savedVideoComment._id as Schema.Types.ObjectId)
      : undefined;
  }

  /*
   * username
   * role
   * text
   * timestamp
   *
   */
  static async getComments(
    video_id: string,
  ): Promise<IVideoComment[] | undefined> {
    const videoComments = await VideoComment.find({ video_id });
    if (!videoComments) return undefined;

    const commentPromises = videoComments.map(async (videoComment) => {
      let comment = await Comment.findById(videoComment.comment_id);
      let user = await User.findById(videoComment.user_id);
      if (!comment || !user) return undefined;
      return {
        user: {
          username: user.username,
          role: user.role,
        },
        comment: {
          text: comment.text,
          timestamp: comment.timestamp,
        },
      };
    });

    const resolvedPromises = await Promise.all(commentPromises);
    const comments = resolvedPromises.filter(
      (comment): comment is IVideoComment => comment !== null,
    );
    return comments;
  }

  static async getInformation(video_id: string): Promise<IVideo | undefined> {
    if (!isValidObjectId(video_id)) {
      return undefined;
    }
    const video = await Video.findById(video_id);
    if (!video) return undefined;
    return video;
  }
}
