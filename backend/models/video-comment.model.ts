import { Schema, model, Document } from "mongoose";

export interface IVideoComment extends Document {
  userId: Schema.Types.ObjectId;
  videoId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
}

const videoCommentSchema = new Schema<IVideoComment>({
  userId: { type: Schema.Types.ObjectId, required: true },
  videoId: { type: Schema.Types.ObjectId, required: true },
  commentId: { type: Schema.Types.ObjectId, required: true },
});

const VideoComment = model<IVideoComment>("VideoComment", videoCommentSchema);

export default VideoComment;
