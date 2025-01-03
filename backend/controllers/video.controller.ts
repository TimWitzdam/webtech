import { Request, Response } from "express";
import { VideoService } from "../services/video.service";

export class VideoController {
  static async create(req: Request, res: Response) {
    const { title, slug, url, length } = req.body;
    if (typeof length !== "number") {
      res.status(403);
      return;
    }
    const video_id = await VideoService.create(title, slug, url, length);
    if (!video_id) {
      res.status(403);
      return;
    }
    res.json({ video: video_id });
    return;
  }
}
