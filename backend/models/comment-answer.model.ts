import { Schema, model, Document } from "mongoose";

export interface ICommentAnswer extends Document {
  parentCommentId: Schema.Types.ObjectId;
  childrenCommentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const commentAnswerSchema = new Schema<ICommentAnswer>({
  parentCommentId: { type: Schema.Types.ObjectId, required: true },
  childrenCommentId: { type: Schema.Types.ObjectId, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const CommentAnswer = model<ICommentAnswer>(
  "CommentAnswer",
  commentAnswerSchema,
);

export default CommentAnswer;
