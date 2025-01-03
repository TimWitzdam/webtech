import express from "express";
import authenticationRoutes from "../routes/authentication.route";
import courseRoutes from "./course.route";
import videoRoutes from "./video.route";

const apiRouter = express.Router();

apiRouter.use(authenticationRoutes);
apiRouter.use(courseRoutes);
apiRouter.use(videoRoutes);

export default apiRouter;
