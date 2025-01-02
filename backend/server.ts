import express from "express";
import Logger from "./lib/logger";
import { PORT, MONGO_URL } from "./configs/app.config";
import apiRouter from "./routes/index.route";
import { connect } from "mongoose"

const logger = new Logger("server");
logger.info("Server starting");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

async function main() {
  const connectionURL = MONGO_URL;
  if (!connectionURL) {
    console.error("Database connectionURL missing!");
    process.exit(1);
  }
  const mongooseResponse = await connect(connectionURL)
  logger.info(`DB connected mongodb ${mongooseResponse.version}!`)


  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

main().catch((error) => {
  logger.error("An error occurred while starting the server:" + error);
  process.exit(1);
});
