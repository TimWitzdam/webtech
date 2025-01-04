import express from "express";
import { CourseController } from "../controllers/course.controller";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { courseCreateRequest } from "../models/course.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { courseAddRequest } from "../models/course.add.request";
import { courseJoinRequest } from "../models/course.join.request";

const courseRoutes = express.Router();

courseRoutes.get("/course/all", authenticateJWT, CourseController.getAll);

courseRoutes.post(
  "/course/create",
  validateSchema(courseCreateRequest),
  authenticateJWT,
  CourseController.create,
);

courseRoutes.post(
  "/course/add",
  validateSchema(courseAddRequest),
  authenticateJWT,
  CourseController.add,
);

courseRoutes.post(
  "/course/join",
  validateSchema(courseJoinRequest),
  authenticateJWT,
  CourseController.join,
);

export default courseRoutes;
