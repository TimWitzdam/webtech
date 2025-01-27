import express from "express";
import { logger } from "./configs/app.config";
import { PORT, MONGO_URL } from "./configs/app.config";
import apiRouter from "./routes/index.route";
import { connect } from "mongoose";
import cors from "cors";

logger.info("Server starting");

const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api", apiRouter);

async function main() {
  const connectionURL = MONGO_URL;
  if (!connectionURL) {
    console.error("Database connectionURL missing!");
    process.exit(1);
  }
  const mongooseResponse = await connect(connectionURL);
  logger.info(`DB connected mongodb ${mongooseResponse.version}!`);

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

main().catch((error) => {
  logger.error("An error occurred while starting the server:" + error);
  process.exit(1);
});
