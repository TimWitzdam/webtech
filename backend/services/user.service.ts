import User from "../models/user.model";

export class UserService {
  static async createUser(username: string, password: string) {
    const user = new User({ username, password });
    return await user.save();
  }

  static async getUserByUsername(username: string) {
    return await User.findOne({ username });
  }
}
