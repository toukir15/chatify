import { Schema, model } from "mongoose";
import { TMessage } from "./message.interface";

const messageSchema = new Schema<TMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId },
    senderId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = model<TMessage>("Message", messageSchema);
