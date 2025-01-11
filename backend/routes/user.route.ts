import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { authRequest } from "../models/user.request";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { userWatchRequest } from "../models/user.watch.request";

const userRoutes = express.Router();

userRoutes.post(
  "/user/login",
  validateSchema(authRequest),
  UserController.login,
);

userRoutes.post(
  "/user/register",
  validateSchema(authRequest),
  UserController.register,
);

// Mark current progress in video for user
userRoutes.post(
  "/user/watch",
  validateSchema(userWatchRequest),
  authenticateJWT,
  UserController.watch,
);

// User information e.g. (Username, Role)
userRoutes.get(
  "/user/information",
  authenticateJWT,
  UserController.getUserInformation,
);

// Videos the user recently viewed
userRoutes.get("/user/lastseen", authenticateJWT, UserController.lastSeen);

// Get user related courses
userRoutes.get("/user/courses", authenticateJWT, UserController.getCourses);

// Save video for user
userRoutes.post("/user/save", authenticateJWT, UserController.saveVideo);

userRoutes.get("/user/saved", authenticateJWT, UserController.savedVideos);

export default userRoutes;
