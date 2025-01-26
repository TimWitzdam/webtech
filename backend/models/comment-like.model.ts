import { Schema, model, Document } from "mongoose";

export interface ICommentLike extends Document {
  userId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
}

const commentLikeSchema = new Schema<ICommentLike>({
  userId: { type: Schema.Types.ObjectId, required: true },
  commentId: { type: Schema.Types.ObjectId, required: true },
});

const CommentLike = model<ICommentLike>("CommentLike", commentLikeSchema);

export default CommentLike;
