import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { authRequest } from "../models/user.request";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";

const userRouter = express.Router();

userRouter.post("/login", validateSchema(authRequest), UserController.login);
userRouter.post(
  "/register",
  validateSchema(authRequest),
  UserController.register,
);
userRouter.get("/user/name", authenticateJWT, UserController.getUsername);

export default userRouter;
