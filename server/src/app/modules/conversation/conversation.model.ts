import { Schema, model } from "mongoose";
import { TConversation } from "./conversation.interface";

const conversationSchema = new Schema<TConversation>(
  {
    participants: { type: [Schema.Types.ObjectId] },
    messages: { type: [Schema.Types.ObjectId] },
  },
  { timestamps: true }
);

export const Conversation = model<TConversation>(
  "Conversation",
  conversationSchema
);
