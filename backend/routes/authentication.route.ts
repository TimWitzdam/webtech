import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { authRequest } from "../models/user.request";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";

const authenticationRoutes = express.Router();

authenticationRoutes.post(
  "/user/login",
  validateSchema(authRequest),
  UserController.login,
);

authenticationRoutes.post(
  "/user/register",
  validateSchema(authRequest),
  UserController.register,
);

authenticationRoutes.get(
  "/user/information",
  authenticateJWT,
  UserController.getUserInformation,
);

export default authenticationRoutes;
