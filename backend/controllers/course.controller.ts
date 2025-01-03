import { Request, Response } from "express";
import { CourseService } from "../services/course.service";

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
      res.status(403);
      return;
    }
    res.json({ course: new_course.toString() });
    return;
  }
}
