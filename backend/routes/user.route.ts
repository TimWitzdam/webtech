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

// Sets video as seen
userRoutes.get("/user/seen/:video_id", authenticateJWT, UserController.getSeen);

// Sets video as seen
userRoutes.post("/user/seen", authenticateJWT, UserController.seen);

// Videos the user recently viewed
userRoutes.get("/user/lastseen", authenticateJWT, UserController.lastSeen);

// Get user related courses
userRoutes.get("/user/courses", authenticateJWT, UserController.getCourses);

// Bookmark video for user
userRoutes.post("/user/save", authenticateJWT, UserController.saveVideo);

// Get bookmarked user videos
userRoutes.get("/user/saved", authenticateJWT, UserController.savedVideos);

userRoutes.post(
  "/user/change-password",
  authenticateJWT,
  UserController.changePassword,
);

userRoutes.post("/user/forgot-password", UserController.forgotPassword); //TODO: Decide if needed

userRoutes.get(
  "/user/notifications",
  authenticateJWT,
  UserController.getNotifications,
);

userRoutes.get("/user/search", authenticateJWT, UserController.search);

export default userRoutes;
