import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../configs/app.config";
import User from "../models/user.model";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["auth_session"];
  if (token) {
    jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).redirect("/login");
      }

      let result = await User.findOne({ secret: decoded });
      if (result) {
        if (result.secret === decoded) next();
      } else {
        return res.status(403).redirect("/login");
      }
    });
  } else {
    return res.status(403).redirect("/login");
  }
};
