import express from "express";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { videoCreateRequest } from "../models/video.create.request";
import { authenticateJWT } from "../middlewares/authenticateJWT.middleware";
import { VideoController } from "../controllers/video.controller";
import { videoCommentRequest } from "../models/video.comment.request";

const videoRoutes = express.Router();

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
  "/video/comments/:videoId",
  authenticateJWT,
  VideoController.getComments,
);

videoRoutes.get(
  "/video/stream/:videoId",
  authenticateJWT,
  VideoController.streamVideo,
);

videoRoutes.get(
  "/video/:videoId/information",
  authenticateJWT,
  VideoController.getInformation,
);

videoRoutes.get("/video/:videoId", authenticateJWT, VideoController.findId);

export default videoRoutes;
