import { NextFunction, Request, Response } from "express";
import { Schema } from "zod";
import { logger } from "../configs/app.config";

export function validateSchema(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      logger.warn(`Schema validation failed: ${e}`);
      res.status(400).json({ error: "Invalid request body" });
    }
  };
}
