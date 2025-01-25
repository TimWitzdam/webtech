import express from "express";
import { CourseController } from "../controllers/course.controller";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { courseCreateRequest } from "../models/course.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { courseAddRequest } from "../models/course.add.request";
import { courseJoinRequest } from "../models/course.join.request";
import { memberOfCourse } from "../middlewares/memberOfCourse.middleware";

const courseRoutes = express.Router();

// Create new course
courseRoutes.post(
  "/course/create",
  validateSchema(courseCreateRequest),
  authenticateJWT,
  CourseController.create,
);

// Add video too course
courseRoutes.post(
  "/course/add",
  validateSchema(courseAddRequest),
  authenticateJWT,
  CourseController.add,
);

// Add user too course
courseRoutes.post(
  "/course/join",
  validateSchema(courseJoinRequest),
  authenticateJWT,
  CourseController.join,
);

courseRoutes.get(
  "/course/find/:slug",
  authenticateJWT,
  CourseController.findBySlug,
);

courseRoutes.get(
  "/course/:courseId",
  authenticateJWT,
  memberOfCourse(),
  CourseController.courseInformations,
);

courseRoutes.get(
  "/course/image/:courseId",
  authenticateJWT,
  memberOfCourse(),
  CourseController.getImage,
);

export default courseRoutes;
