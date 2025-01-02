import express from "express";
import Logger from "./lib/logger";
import { PORT } from "./configs/app.config";
import apiRouter from "./routes/index.route";

const logger = new Logger("server");
logger.info("Server starting");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

async function main() {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

main().catch((error) => {
  logger.error("An error occurred while starting the server:" + error);
  process.exit(1);
});
