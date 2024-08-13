import { Schema, model } from "mongoose";
import { TMessage } from "./message.interface";

const messageSchema = new Schema<TMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: false,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Map,
      of: Boolean,
    },
    isRemove: {
      type: Map,
      of: Boolean,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    reply: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model<TMessage>("Message", messageSchema);
