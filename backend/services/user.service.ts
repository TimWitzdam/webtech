import { Schema } from "mongoose";
import User from "../models/user.model";
import Video from "../models/video.model";
import UserVideo from "../models/user-video.model";
import { ILastSeenVideo } from "../types/LastSeenVideo";

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
    video_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    progress: number,
  ): Promise<Schema.Types.ObjectId | undefined> {
    const video = await Video.findById(video_id);
    const user = await User.findById(user_id);
    if (!video || !user) {
      return undefined;
    }

    const userVideo = new UserVideo({
      video_id,
      user_id,
      progress,
      last_seen: new Date(),
    });
    const savedUserVideo = await userVideo.save();
    return savedUserVideo === userVideo
      ? (savedUserVideo._id as Schema.Types.ObjectId)
      : undefined;
  }

  static async getLatestVideos(
    user_id: Schema.Types.ObjectId,
  ): Promise<ILastSeenVideo[] | undefined> {
    let latestVideoDocuments = await UserVideo.find({ user_id });
    let latestVideos: ILastSeenVideo[] = [];

    if (!latestVideoDocuments) return undefined;

    const videoPromises = latestVideoDocuments.map(async (userVideo) => {
      let video = await Video.findById(userVideo.video_id);
      if (video) {
        let tmp = {
          video: {
            _id: video._id as Schema.Types.ObjectId,
            title: video.title,
            slug: video.slug,
            url: video.url,
            length: video.length,
            creation_date: video.creation_date,
          },
          last_seen: userVideo.last_seen,
          progress: userVideo.progress,
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
}
