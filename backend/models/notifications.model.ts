import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  user_id: Schema.Types.ObjectId;
  text: string;
  date: Date;
}

const notificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true, default: new Date() },
});

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
