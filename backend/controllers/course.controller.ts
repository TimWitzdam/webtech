import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { isValidObjectId } from "mongoose";
const { ObjectId } = require("mongoose").mongo;

import { FILE_PATH, ROLES } from "../configs/app.config";
import * as fs from "fs";
import mime from "mime";

export class CourseController {
  static async create(req: Request, res: Response) {
    const user_id = res.locals.decodedJWT;
    const { name, slug, description, collaboratorIds, languages } = req.body;
    let new_course = await CourseService.create(
      name,
      slug,
      description,
      user_id,
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
    const courseId = req.params.courseId;
    if (!isValidObjectId(courseId)) return undefined;

    const information = await CourseService.findById(new ObjectId(courseId));
    const courseVideos = await CourseService.getCourseVideos(
      new ObjectId(courseId),
    );
    res.json({
      course: {
        ...information,
        videos: courseVideos,
      },
    });
    return;
  }

  static async add(req: Request, res: Response) {
    const { course_id, video_id } = req.body;
    if (!isValidObjectId(course_id) || !isValidObjectId(video_id)) {
      res.status(403).json({ error: "Invalid ObjectId!" });
      return;
    }

    const newCourseVideo = await CourseService.add(course_id, video_id);
    if (!newCourseVideo) {
      res.status(403).json({ error: "Kurs konnte nicht erstellt werden!" });
      return;
    }
    res.json({ course: course_id });
    return;
  }

  static async join(req: Request, res: Response) {
    const { course_id, permission } = req.body;
    const user_id = res.locals.decodedJWT;

    if (!isValidObjectId(course_id) || !isValidObjectId(user_id)) {
      res.status(403).json({ error: "Invalid ObjectId!" });
      return;
    }
    if (!ROLES.includes(permission)) {
      res.status(403).json({ error: "Permission unknown!" });
      return;
    }

    const newCourseUser = await CourseService.join(
      course_id,
      user_id,
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
    const course_id = req.params.course_id;
    if (!course_id || !isValidObjectId(course_id)) {
      res.status(400).json({ status: "Keine oder falsche Kurs-ID angegeben!" });
      return;
    }
    const coursePath = `${FILE_PATH}/images/${course_id}`;
    if (!fs.existsSync(coursePath)) {
      res.status(404).json({ status: "Video nicht gefunden!" });
      return;
    }

    let mimeType = mime.getType(coursePath) || "image/png";
    res.setHeader("Content-Type", mimeType);
    res.sendFile(coursePath);
    return;
  }
}
