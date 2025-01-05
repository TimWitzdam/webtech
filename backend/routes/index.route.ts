import express from "express";
import courseRoutes from "./course.route";
import videoRoutes from "./video.route";
import userRoutes from "./user.route";

const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(courseRoutes);
apiRouter.use(videoRoutes);

export default apiRouter;
