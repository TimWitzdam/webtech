import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { videoCreateRequest } from "../models/video.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { VideoController } from "../controllers/video.controller";

const videoRoutes = express.Router();

// Get all videos existing
videoRoutes.get("/video/all", authenticateJWT, VideoController.getAll);

// Create new video
videoRoutes.post(
  "/video/create",
  validateSchema(videoCreateRequest),
  authenticateJWT,
  VideoController.create,
);

export default videoRoutes;
