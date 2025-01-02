import { Schema, model, Document } from "mongoose";

export interface IVideo extends Document {
  title: string,
  slug: string,
  url: string,
  length: number,
  creation_date: Date
}

const videoSchema = new Schema<IVideo>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  url: { type: String, required: true },
  length: { type: Number, required: true },
  creation_date: { type: Date, required: true, default: new Date() }
});

const Video = model<IVideo>("Video", videoSchema);

export default Video;
