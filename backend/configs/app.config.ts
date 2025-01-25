import { exit } from "process";
import Logger from "../lib/logger";
import multer from "multer";
import fs from "fs";
import path from "path";

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

const videoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!process.env.FILE_PATH) return null;

    const uploadPath = `${process.env.FILE_PATH.toString()}/videos`;
    if (!uploadPath) return null;

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!process.env.FILE_PATH) return null;

    const uploadPath = `${process.env.FILE_PATH.toString()}/images`;
    if (!uploadPath) return null;

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const videoUpload = multer({ storage: videoStorage });
export const imageUpload = multer({ storage: imageStorage });
