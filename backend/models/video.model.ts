import { Schema, model, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  length: number;
  uploaderId: Schema.Types.ObjectId;
  creationDate: Date;
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  length: { type: Number, required: true },
  creationDate: { type: Date, required: true, default: new Date() },
  uploaderId: { type: Schema.Types.ObjectId, required: true },
});

const Video = model<IVideo>("Video", videoSchema);

export default Video;
