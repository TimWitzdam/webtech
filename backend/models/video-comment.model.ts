import { Schema, model, Document } from "mongoose";

export interface IVideoComment extends Document {
  user_id: Schema.Types.ObjectId;
  video_id: Schema.Types.ObjectId;
  comment_id: Schema.Types.ObjectId;
}

const videoCommentSchema = new Schema<IVideoComment>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  video_id: { type: Schema.Types.ObjectId, required: true },
  comment_id: { type: Schema.Types.ObjectId, required: true },
});

const VideoComment = model<IVideoComment>("VideoComment", videoCommentSchema);

export default VideoComment;
