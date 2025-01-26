import { Request, Response } from "express";
import { VideoService } from "../services/video.service";
import { ERROR_MESSAGE, FILE_PATH } from "../configs/app.config";
import { isValidObjectId } from "mongoose";
const { ObjectId } = require("mongoose").mongo;
import * as fs from "fs";
import mime from "mime";
import { UserService } from "../services/user.service";

export class VideoController {
  // Add video storing
  static async create(req: Request, res: Response) {
    const { title, length } = req.body;
    if (typeof length !== "number") {
      res.status(400).json({ error: "Die länge des Videos ist keine Zahl" });
      return;
    }
    const videoId = await VideoService.create(title, length);
    if (!videoId) {
      res.status(500).json({ error: "Video konnte nicht erstellt werden!" });
      return;
    }
    res.json({ video: videoId });
    return;
  }

  static async getImage(req: Request, res: Response) {
    const videoId = req.params.videoId;
    if (!videoId || !isValidObjectId(videoId)) {
      res.status(400).json({ status: "Keine oder falsche Kurs-ID angegeben!" });
      return;
    }
    const coursePath = `${FILE_PATH}/images/${videoId}`;
    if (!fs.existsSync(coursePath)) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }

    let mimeType = mime.getType(coursePath) || "image/png";
    res.setHeader("Content-Type", mimeType);
    res.sendFile(coursePath);
    return;
  }

  static async createComment(req: Request, res: Response) {
    const { videoId, text } = req.body;
    const userId = res.locals.decodedJWT;
    const result = await VideoService.createComment(userId, videoId, text);
    if (!result) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ status: result });
    return;
  }

  static async getComments(req: Request, res: Response) {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
      res.status(400).json({ status: ERROR_MESSAGE });
      return;
    }
    const result = await VideoService.getComments(videoId);
    if (!result) {
      res.status(404).json({ status: "Keine Kommentare gefunden!" });
    }
    res.json({ comments: result });
  }

  static async getInformation(req: Request, res: Response) {
    const videoId = req.params.videoId;
    const userId = res.locals.decodedJWT;

    const videoInformation = await VideoService.getInformation(videoId);
    let videoCourses = await VideoService.getCourses(videoId);
    let userVideo = await VideoService.getUserData(
      userId,
      new ObjectId(videoId),
    );

    if (!videoInformation) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }
    if (!videoCourses) {
      videoCourses = [];
    }

    res.json({
      information: {
        video: videoInformation,
        course: videoCourses,
        user: {
          progress: userVideo ? userVideo.progress : 0,
          seen: userVideo ? userVideo.seen : false,
        },
      },
    });
    return;
  }

  static async streamVideo(req: Request, res: Response) {
    const videoId = req.params.videoId;
    const range = req.headers.range || "1000";
    if (!videoId || !range) {
      res.status(400).json({ status: "Fehlende Parameter!" });
      return;
    }

    const video = await VideoService.getInformation(videoId);
    if (!video) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }

    const videoPath = `${FILE_PATH}/videos/${video._id}`;
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }
    let mimeType = mime.getType(videoPath) || "video/mp4";
    const videoSize = fs.statSync(`${FILE_PATH}/videos/${video._id}`).size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": mimeType,
    };

    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  }

  static async findId(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const videoId = req.params.videoId;

    if (!isValidObjectId(videoId)) {
      res
        .status(400)
        .json({ status: "Keine oder falsche Video-ID angegeben!" });
      return;
    }

    const video = await VideoService.getInformation(videoId);
    if (!video) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }

    const seen = await UserService.checkIfSeen(userId, video._id as string);
    if (!seen) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }

    const user = await UserService.getInformation(userId);
    if (!user) {
      res.status(401).json({ status: "Benutzer nicht gefunden!" });
      return;
    }

    const courses = await VideoService.getCourses(video._id as string);
    if (courses === null) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }

    const result = {
      _id: video._id,
      title: video.title,
      length: video.length,
      creation_date: video.creationDate,
      uploader: {
        username: user.username,
        role: user.role,
      },
      courses,
    };

    res.json({ video: result });
    return;
  }

  static async likeComment(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { commentId } = req.body;

    const check = await VideoService.checkIfLiked(userId, commentId);
    if (check) {
      res.status(401).json({ status: "Bereits ein like gegeben!" });
      return;
    }

    const like = await VideoService.likeComment(userId, commentId);
    if (!like) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }

    res.json({ like });
    return;
  }

  static async answerComment(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { commentId, text } = req.body;
    if (!isValidObjectId(commentId)) {
      res
        .status(400)
        .json({ status: "Keine oder falsche Kommentar-ID angegeben!" });
      return;
    }
    const newAnswer = await VideoService.answerComment(userId, commentId, text);
    if (!newAnswer) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }

    res.json({ comment: newAnswer });
    return;
  }
}
