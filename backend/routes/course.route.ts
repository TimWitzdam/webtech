import express from "express";
import { CourseController } from "../controllers/course.controller";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { courseCreateRequest } from "../models/course.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";

const courseRoutes = express.Router();

courseRoutes.get("/course/all", authenticateJWT, CourseController.getAll);

courseRoutes.post(
  "/course/create",
  validateSchema(courseCreateRequest),
  authenticateJWT,
  CourseController.create,
);

export default courseRoutes;
