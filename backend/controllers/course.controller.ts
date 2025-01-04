import { Request, Response } from "express";
import { CourseService } from "../services/course.service";
import { isValidObjectId } from "mongoose";

export class CourseController {
  static async getAll(req: Request, res: Response) {
    const courses = await CourseService.getAll();
    res.json({ courses });
    return;
  }

  static async create(req: Request, res: Response) {
    const user_id = res.locals.decodedJWT;
    const { name, slug } = req.body;
    let new_course = await CourseService.create(name, slug, user_id);
    if (!new_course) {
      res.status(403).json({ error: "Couldn't create course!" });
      return;
    }
    res.json({ course: new_course.toString() });
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
      res.status(403).json({ error: "Couldn't add video too course!" });
      return;
    }
    res.json({ course: course_id });
    return;
  }
}
