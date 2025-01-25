import type { Request, Response, NextFunction } from "express";
import CourseUser from "../models/course-user.model";
import Course from "../models/course.model";

export function memberOfCourse() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.decodedJWT;
    const { courseId, slug } = req.params;
    if (courseId) {
      const response = await CourseUser.find({ userId, courseId });
      if (!response) {
        res.status(404).json({ status: "Kurs konnte nicht gefunden werden!" });
        return;
      }
      if (response.length > 0 && response[0].userId.toString() === userId) {
        next();
        return;
      }
    } else if (slug) {
      const course = await Course.find({ slug });
      if (!course) {
        res.status(404).json({ status: "Kurs konnte nicht gefunden werden!" });
        return;
      }
      const response = await CourseUser.find({
        userId,
        courseId: course[0]._id,
      });
      if (!response) {
        res.status(404).json({ status: "Kurs konnte nicht gefunden werden!" });
        return;
      }
      if (response.length > 0 && response[0].userId.toString() === userId) {
        console.log("ETST");
        next();
        return;
      }
    }
    res.status(403).json({ status: "Sie sind nicht teil dieses Kurses!" });
    return;
  };
}
