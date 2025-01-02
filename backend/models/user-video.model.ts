import { Schema, model, Document } from "mongoose";

export interface IUserVideo extends Document {
  video_id: Document,
  user_id: Document,
  last_seen: Date,
  progress: number,
}

const userVideoSchema = new Schema<IUserVideo>({
  video_id: {type: Document, require: true},
  user_id: {type: Document, require: true},
  last_seen: {type: Date, require: true, default: new Date()},
  progress: {type: Number, require: true},
});

const userVideo = model<IUserVideo>("UserVideo", userVideoSchema);

export default userVideo;
