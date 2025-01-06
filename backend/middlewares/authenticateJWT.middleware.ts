import type { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt.service";
import getCookie from "../lib/cookies";
import { ERROR_MESSAGE, logger } from "../configs/app.config";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = getCookie(req.headers.cookie, "auth_session");
  if (token) {
    let decoded = await JWTService.verifyJWTToken(token);
    if (decoded) {
      res.locals.decodedJWT = decoded;
      next();
    } else {
      logger.error("Couldn't decode JWT Token!");
      res.status(403).json({ error: ERROR_MESSAGE });
      return;
    }
  } else {
    logger.warn("auth_session cookies wasn't found!");
    res.status(400).json({ error: ERROR_MESSAGE });
    return;
  }
};
