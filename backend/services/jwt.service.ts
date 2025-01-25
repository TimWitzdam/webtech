import { JWT_SECRET, logger } from "../configs/app.config";
import { UserService } from "./user.service";
import jwt from "jsonwebtoken";

export class JWTService {
  static createJWTToken(id: string, length: string | null = "7d"): string {
    if (!length) {
      const jwtToken = jwt.sign({ id }, JWT_SECRET, {});
      return jwtToken;
    }
    const jwtToken = jwt.sign({ id }, JWT_SECRET, {
      expiresIn: length,
    });
    return jwtToken;
  }

  static async verifyJWTToken(token: string): Promise<string | null> {
    try {
      const dtoken = jwt.verify(token, JWT_SECRET);
      if (typeof dtoken === "object") {
        let result = await UserService.getId(dtoken.id);
        if (result) {
          if (result.toString() === dtoken.id) {
            return result.toString();
          }
        }
      }
    } catch (error) {
      logger.error(`Verification of JWT Token failed: \n ${error}`);
      return null;
    }
    return null;
  }
}
