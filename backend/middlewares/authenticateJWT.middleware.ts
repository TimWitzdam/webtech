import type { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt.service";
import getCookie from "../lib/cookies";

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
      res.status(403);
      return;
    }
  } else {
    res.status(403);
    return;
  }
};
