import { Schema, model, Document } from "mongoose";

export interface ISaved extends Document {
  videoId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  creation_date: Date;
}

const savedSchema = new Schema<ISaved>({
  videoId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  creation_date: { type: Date, required: true, default: new Date() },
});

const Saved = model<ISaved>("Saved", savedSchema);

export default Saved;
