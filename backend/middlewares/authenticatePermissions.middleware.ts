import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { ERROR_MESSAGE, logger } from "../configs/app.config";

export function authenticatePermissions(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user_id = res.locals.decodedJWT;
    if (!user_id) {
      logger.error(
        `Couldn't read res.locals.decodedJWT ${user_id} (authenticatePermissions)`,
      );
      res.status(500).json({ error: ERROR_MESSAGE });
      return;
    }
    const user_document = await User.findById(user_id);
    if (user_document) {
      if (user_document.role === role) {
        next();
        return;
      }
      res.status(403).json({ error: "Fehlende Berechtigung!" });
      return;
    }
    logger.warn(
      `User with ID: ${user_id} wasn't found! (authenticatePermissions)`,
    );
    res.status(500).json({ error: ERROR_MESSAGE });
    return;
  };
}
