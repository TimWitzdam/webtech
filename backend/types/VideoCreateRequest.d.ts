import { Request } from "express";
import { IVideo } from "../models/video.model";

export interface VideoCreateRequest extends Request {
  video: IVideo;
}
