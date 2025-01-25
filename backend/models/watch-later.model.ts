import { Schema, model, Document } from "mongoose";

export interface IWatchLater extends Document {
  userId: Schema.Types.ObjectId;
  videoId: Schema.Types.ObjectId;
}

const watchLaterSchema = new Schema<IWatchLater>({
  userId: { type: Schema.Types.ObjectId, required: true },
  videoId: { type: Schema.Types.ObjectId, required: true },
});

const WatchLater = model<IWatchLater>("WatchLater", watchLaterSchema);

export default WatchLater;
