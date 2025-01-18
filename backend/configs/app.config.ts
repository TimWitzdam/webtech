import { exit } from "process";
import Logger from "../lib/logger";

export const PORT = 3000;
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set");
  exit(1);
}
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URL = process.env.MONGO_URL;
export const FILE_PATH = process.env.FILE_PATH;
export const ROLES = ["Student", "Professor", "Assistent", "Administrator"];
export const ERROR_MESSAGE =
  "Unbekannter Fehler, bitte versuchen Sie es später erneut!";
export const logger = new Logger("server");
