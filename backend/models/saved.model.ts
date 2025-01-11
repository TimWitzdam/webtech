import { Schema, model, Document } from "mongoose";

export interface ISaved extends Document {
  video_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  creation_date: Date;
}

const savedSchema = new Schema<ISaved>({
  video_id: { type: Schema.Types.ObjectId, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  creation_date: { type: Date, required: true, default: new Date() },
});

const Saved = model<ISaved>("Saved", savedSchema);

export default Saved;
