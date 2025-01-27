import { Schema, model, Document } from "mongoose";

export interface ICommentReport extends Document {
  userId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
}

const commentReportSchema = new Schema<ICommentReport>({
  userId: { type: Schema.Types.ObjectId, required: true },
  commentId: { type: Schema.Types.ObjectId, required: true },
});

const CommentReport = model<ICommentReport>(
  "CommentReport",
  commentReportSchema,
);

export default CommentReport;
