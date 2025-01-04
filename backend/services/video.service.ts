import { Schema } from "mongoose";
import Video from "../models/video.model";

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
}
