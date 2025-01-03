import express from "express";
import authenticationRoutes from "../routes/authentication.route";
import courseRoutes from "./course.route";

const apiRouter = express.Router();

apiRouter.use(authenticationRoutes);
apiRouter.use(courseRoutes);

export default apiRouter;
