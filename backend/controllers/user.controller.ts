import { UserService } from "../services/user.service";
import { JWTService } from "../services/jwt.service";
import { ERROR_MESSAGE, logger } from "../configs/app.config";
import { isValidObjectId, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { VideoService } from "../services/video.service";
import { CourseService } from "../services/course.service";

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
        const userId = await UserService.createUser(username, hash);
        const token = JWTService.createJWTToken(userId.toString());
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
      res.status(400).json({ error: "JWT nicht gefunden!" });
      return;
    }

    const userInformation = await UserService.getInformation(
      (await UserService.getId(decodedJWT as ObjectId)) as ObjectId,
    );
    if (!userInformation) {
      res
        .status(500)
        .json({ error: "Benutzerinformationen konnten nicht geladen werden!" });
      return;
    }

    res.json({
      username: userInformation.username,
      role: userInformation.role,
    });
  }

  static async watch(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { videoId, progress } = req.body;
    if (!userId) {
      res.status(400).json({ status: "JWT nicht gefunden!" });
      return;
    }

    const userWatch = await UserService.watch(videoId, userId, progress);

    if (!userWatch) {
      res
        .status(500)
        .json({ status: "Fortschritt konnte nicht gespeichert werden!" });
      return;
    }

    res.json({ id: userWatch });
    return;
  }

  static async lastSeen(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const lastSeen = await UserService.getLatestVideos(userId);
    if (!lastSeen) {
      res.status(404).json({ status: ERROR_MESSAGE });
    }
    res.json({ videos: lastSeen });
    return;
  }

  static async getCourses(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const userCourses = await UserService.getUserCourses(userId);
    if (!userCourses) {
      res.status(404).json({ status: ERROR_MESSAGE });
    }
    res.json({ courses: userCourses });
    return;
  }

  static async saveVideo(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { videoId } = req.body;
    const savedVideo = await UserService.saveVideo(userId, videoId);
    if (!savedVideo) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ id: savedVideo });
    return;
  }

  static async savedVideos(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const savedVideos = await UserService.getSavedVideos(userId);
    if (!savedVideos) {
      res.status(404).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ videos: savedVideos });
    return;
  }

  static async changePassword(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      res.status(400).json({ status: "Fehlende Parameter!" });
    }

    const result = await UserService.changePassword(
      userId,
      old_password,
      new_password,
    );

    if (result === undefined) {
      res.status(501).json({ status: ERROR_MESSAGE });
      return;
    } else if (result === false) {
      res.status(401).json({ status: "Falsches Passwort!" });
      return;
    }

    res.json({ status: "Passwort erfolgreich geändert!" });
    return;
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: "Fehlende Parameter!" });
    }

    const result = await UserService.forgotPassword(email, password);

    if (result === undefined) {
      res.status(501).json({ status: ERROR_MESSAGE });
      return;
    } else if (result === false) {
      res.status(401).json({ status: "Falsches Passwort!" });
      return;
    }

    res.json({ status: "Passwort erfolgreich geändert!" });
    return;
  }

  static async getNotifications(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const notifications = await UserService.getNotifications(userId);
    if (!notifications) {
      res.status(404).json({ status: "Keine neuen Benachrichtigungen" });
    }
    res.json({ notifications });
    return;
  }

  static async search(req: Request, res: Response) {
    const { search } = req.query;
    if (!search) {
      res.status(400).json({ status: "Kein Suchfilter vorhanden!" });
      return;
    }
    const videos = await VideoService.find(search.toString());
    const courses = await CourseService.findByName(search.toString());
    if (!videos || !courses) {
      res.status(404).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ courses, videos });
    return;
  }

  static async seen(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const { videoId } = req.body;
    if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
      res.status(400).json({ status: ERROR_MESSAGE });
      return;
    }
    const response = await UserService.markAsSeen(userId, videoId);
    if (!response) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ status: response });
    return;
  }

  static async getSeen(req: Request, res: Response) {
    const userId = res.locals.decodedJWT;
    const videoId = req.params.videoId;
    if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
      res.status(400).json({ status: ERROR_MESSAGE });
      return;
    }
    const response = await UserService.checkIfSeen(userId, videoId);
    if (!response) {
      res.status(500).json({ status: ERROR_MESSAGE });
      return;
    }
    res.json({ status: response });
    return;
  }
}
