import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { ERROR_MESSAGE, logger } from "../configs/app.config";

export function authenticatePermissions(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.decodedJWT;
    if (!userId) {
      logger.error(
        `Couldn't read res.locals.decodedJWT ${userId} (authenticatePermissions)`,
      );
      res.status(500).json({ error: ERROR_MESSAGE });
      return;
    }
    const userDocument = await User.findById(userId);
    if (userDocument) {
      if (userDocument.role === role) {
        next();
        return;
      }
      res.status(403).json({ error: "Fehlende Berechtigung!" });
      return;
    }
    logger.warn(
      `User with ID: ${userId} wasn't found! (authenticatePermissions)`,
    );
    res.status(500).json({ error: ERROR_MESSAGE });
    return;
  };
}
