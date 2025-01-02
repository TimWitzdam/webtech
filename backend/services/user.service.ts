import { ObjectId } from "mongoose";
import User from "../models/user.model";

export class UserService {
  static async createUser(
    username: string,
    password: string,
    role: string = "Student",
  ): Promise<any | undefined> {
    if (!role) role = "Student";

    const user = new User({
      username,
      password,
      role,
    });
    const saved_user = await user.save();
    return saved_user === user ? (saved_user._id as ObjectId) : undefined;
  }

  static async getInformation(id: ObjectId) {
    let result = await User.findById(id);
    return result ? result : undefined;
  }

  static async getIdByUsername(username: string) {
    let result = await User.findOne({ username });
    return result ? result._id : undefined;
  }

  static async getId(id: ObjectId) {
    let result = await User.findById(id);
    return result ? result._id : undefined;
  }
}
