import { Schema, model, Document } from "mongoose";

export interface IUserVideo extends Document {
  video_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  seen: boolean;
  last_seen: Date;
  progress: number;
}

const userVideoSchema = new Schema<IUserVideo>({
  video_id: { type: Schema.Types.ObjectId, require: true },
  user_id: { type: Schema.Types.ObjectId, require: true },
  seen: { type: Boolean, require: true },
  last_seen: { type: Date, require: true, default: new Date() },
  progress: { type: Number, require: true },
});

const UserVideo = model<IUserVideo>("UserVideo", userVideoSchema);

export default UserVideo;
