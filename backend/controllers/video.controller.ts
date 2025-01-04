import { Request, Response } from "express";
import { VideoService } from "../services/video.service";

export class VideoController {
  static async getAll(req: Request, res: Response) {
    const videos = await VideoService.getAll();
    res.json({ videos });
    return;
  }

  static async create(req: Request, res: Response) {
    const { title, slug, url, length } = req.body;
    if (typeof length !== "number") {
      res.status(403).json({ error: "Die länge des Videos ist keine Zahl" });
      return;
    }
    const video_id = await VideoService.create(title, slug, url, length);
    if (!video_id) {
      res.status(403).json({ error: "Video konnte nicht erstellt werden!" });
      return;
    }
    res.json({ video: video_id });
    return;
  }
}
