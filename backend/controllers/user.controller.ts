import { UserService } from "../services/user.service";
import { JWTService } from "../services/jwt.service";
import { logger } from "../configs/app.config";
import { ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export class UserController {
  static async login(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserService.getInformation(
      (await UserService.getIdByUsername(username)) as ObjectId,
    );

    if (!user) {
      res.status(401).json({ error: "Falsche Zugangsdaten!" });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        res.status(401).json({ error: "Falsche Zugangsdaten!" });
        return;
      }

      const token = JWTService.createJWTToken(
        (user._id as ObjectId).toString(),
      );
      res.json({ token });
    });
  }

  static async register(req: Request, res: Response) {
    const username = req.body.username;
    const password = req.body.password;

    try {
      let hash = await bcrypt.hash(password, 10);
      if (hash) {
        const userID = await UserService.createUser(username, hash);
        const token = JWTService.createJWTToken(userID.toString());
        res.json({ token });
        return;
      } else {
        res.status(500).json({ error: "Etwas ist schiefgelaufen!" });
        return;
      }
    } catch (err) {
      logger.error(`bcrypt error: ${err}`);
      res.status(500).json({ error: "Etwas ist schiefgelaufen!" });
      return;
    }
  }

  static async getUserInformation(req: Request, res: Response) {
    const decodedJWT = res.locals.decodedJWT;
    if (!decodedJWT) {
      res.status(403).json({ error: "JWT nicht gefunden!" });
      return;
    }

    const userInformation = await UserService.getInformation(
      (await UserService.getId(decodedJWT as ObjectId)) as ObjectId,
    );
    if (!userInformation) {
      res
        .status(403)
        .json({ error: "Benutzerinformationen konnten nicht geladen werden!" });
      return;
    }

    res.json({
      username: userInformation.username,
      role: userInformation.role,
    });
  }

  static async watch(req: Request, res: Response) {
    const user_id = res.locals.decodedJWT;
    const { video_id, progress } = req.body;
    if (!user_id) {
      res.status(403).json({ error: "JWT nicht gefunden!" });
      return;
    }

    const userWatch = await UserService.watch(video_id, user_id, progress);

    if (!userWatch) {
      res
        .status(403)
        .json({ error: "Fortschritt konnte nicht gespeichert werden!" });
      return;
    }

    res.json({ id: userWatch });
    return;
  }
}
