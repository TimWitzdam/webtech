import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { authRequest } from "../models/user.request";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { userWatchRequest } from "../models/user.watch.request";
import User from "../models/user.model";

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

userRoutes.post(
  "/user/watch",
  validateSchema(userWatchRequest),
  authenticateJWT,
  UserController.watch,
);

userRoutes.get(
  "/user/information",
  authenticateJWT,
  UserController.getUserInformation,
);

userRoutes.get("/user/lastseen", authenticateJWT, UserController.lastSeen);

export default userRoutes;
