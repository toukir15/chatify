import { Types } from "mongoose";

export type TConversation = {
  participants: [Types.ObjectId];
  messages: [Types.ObjectId];
};
