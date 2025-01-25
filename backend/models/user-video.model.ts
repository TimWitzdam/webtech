import { Schema, model, Document } from "mongoose";

export interface IUserVideo extends Document {
  videoId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  seen: boolean;
  lastSeen: Date;
  progress: number;
}

const userVideoSchema = new Schema<IUserVideo>({
  videoId: { type: Schema.Types.ObjectId, require: true },
  userId: { type: Schema.Types.ObjectId, require: true },
  seen: { type: Boolean, require: true },
  lastSeen: { type: Date, require: true, default: new Date() },
  progress: { type: Number, require: true },
});

const UserVideo = model<IUserVideo>("UserVideo", userVideoSchema);

export default UserVideo;
