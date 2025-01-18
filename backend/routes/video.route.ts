import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { videoCreateRequest } from "../models/video.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { VideoController } from "../controllers/video.controller";
import { videoCommentRequest } from "../models/video.comment.request";

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

videoRoutes.post(
  "/video/comment",
  validateSchema(videoCommentRequest),
  authenticateJWT,
  VideoController.createComment,
);

videoRoutes.get(
  "/video/comments/:video_id",
  authenticateJWT,
  VideoController.getComments,
);

videoRoutes.get(
  "/video/:video_id",
  authenticateJWT,
  VideoController.streamVideo,
);

export default videoRoutes;
