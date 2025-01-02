import { UserService } from "../services/user.service";
import { JWT_SECRET } from "../configs/app.config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export class UserController {
  static async login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserService.getUserByUsername(username);

    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        res.status(401).send("Invalid credentials");
        return;
      }

      const token = this.createJWTToken(username);
      res.json({ token });
    });
  }

  static async register(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      const token = this.createJWTToken(username);
      UserService.createUser(username, hash);

      res.json({ token });
    });
  }

  static async getUsername(req: Request, res: Response) {
    const username = (req as AuthenticatedRequest).user.username;
    res.json({ username });
  }

  static createJWTToken(username: string) {
    const jwtToken = jwt.sign({ username: username }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return jwtToken;
  }
}
