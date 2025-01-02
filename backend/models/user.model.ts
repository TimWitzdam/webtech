import { Schema, model, Document } from "mongoose";
import { ROLES } from "../configs/app.config";

export interface IUser extends Document {
  username: string;
  password: string;
  role: string;
  jwt_token: string;
  creation_date: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: {type: String, required: true, enum: ROLES},
  jwt_token: {type: String, required: true},
  creation_date: {type: Date, required: true, default: new Date()}
});

const User = model<IUser>("User", userSchema);

export default User;
