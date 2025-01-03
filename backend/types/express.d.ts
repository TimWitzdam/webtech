import "express";
import { IUser } from "../models/user.model";
import { ICourse } from "../models/course.model";
import { IVideo } from "../models/video.model";

declare module "express" {
  export interface Request {
    user?: IUser;
    course?: ICourse;
    video?: IVideo;
  }
}
