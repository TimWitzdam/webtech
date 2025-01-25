import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { isValidObjectId } from "mongoose";
const { ObjectId } = require("mongoose").mongo;

import { ERROR_MESSAGE, FILE_PATH, ROLES } from "../configs/app.config";
import * as fs from "fs";
import mime from "mime";

export class CourseController {
  static async create(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { name, slug, emoji, description, collaboratorIds, languages } =
      req.body;
    let new_course = await CourseService.create(
      name,
      slug,
      emoji,
      description,
      userId,
      collaboratorIds,
      languages,
    );
    if (!new_course) {
      res.status(403).json({ error: "Konnte Kurs nicht erstellen!" });
      return;
    }
    res.json({ course: new_course.toString() });
    return;
  }

  static async courseInformations(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const courseId = req.params.courseId;
    if (!isValidObjectId(courseId)) {
      res.status(400).json({ status: "Keine oder falsche Kurs-ID angegeben!" });
      return;
    }

    const information = await CourseService.findById(new ObjectId(courseId));
    const courseVideos = await CourseService.getCourseVideos(
      new ObjectId(userId),
      new ObjectId(courseId),
    );

    if (!courseVideos) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }

    if (!information) {
      res.status(404).json({ status: "Kurs konnte nicht gefunden werden!" });
      return;
    }

    const progress = courseVideos.filter((courseVideo) =>
      courseVideo.seen ? true : null,
    );

    res.json({
      course: {
        ...information,
        videos: courseVideos,
        progress: { current: progress.length, total: courseVideos.length },
      },
    });
    return;
  }

  static async add(req: Request, res: Response) {
    const { courseId, videoId } = req.body;
    if (!isValidObjectId(courseId) || !isValidObjectId(videoId)) {
      res.status(403).json({ error: "Invalid ObjectId!" });
      return;
    }

    const newCourseVideo = await CourseService.add(courseId, videoId);
    if (!newCourseVideo) {
      res.status(403).json({ error: "Kurs konnte nicht erstellt werden!" });
      return;
    }
    res.json({ course: courseId });
    return;
  }

  static async join(req: Request, res: Response) {
    const { courseId, permission } = req.body;
    const userId = res.locals.decodedJWT;

    if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
      res.status(403).json({ error: "Invalid ObjectId!" });
      return;
    }
    if (!ROLES.includes(permission)) {
      res.status(403).json({ error: "Permission unknown!" });
      return;
    }

    const newCourseUser = await CourseService.join(
      courseId,
      userId,
      permission,
    );

    if (!newCourseUser) {
      res.status(403).json({ error: "Konnte Kurs nicht beitreten!" });
      return;
    }

    res.json({ id: newCourseUser });
    return;
  }

  static async findBySlug(req: Request, res: Response) {
    const slug = req.params.slug;
    const course = await CourseService.findBySlug(slug);
    res.json({ courses: course });
    return;
  }

  static async getImage(req: Request, res: Response) {
    const courseId = req.params.courseId;
    if (!courseId || !isValidObjectId(courseId)) {
      res.status(400).json({ status: "Keine oder falsche Kurs-ID angegeben!" });
      return;
    }
    const coursePath = `${FILE_PATH}/images/${courseId}`;
    if (!fs.existsSync(coursePath)) {
      res.status(404).json({ status: "Kurs nicht gefunden!" });
      return;
    }

    let mimeType = mime.getType(coursePath) || "image/png";
    res.setHeader("Content-Type", mimeType);
    res.sendFile(coursePath);
    return;
  }
}
