import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  user_id: Schema.Types.ObjectId;
  title: string;
  text: string;
  link: string;
  createdAt: Date;
  read: boolean;
}

const notificationSchema = new Schema<INotification>({
  user_id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  read: { type: Boolean, required: true, default: false },
});

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
