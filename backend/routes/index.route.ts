import express from "express";
import authenticationRoutes from "../routes/authentication.route";

const apiRouter = express.Router();

apiRouter.use(authenticationRoutes);

export default apiRouter;
