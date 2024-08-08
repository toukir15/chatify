import { Types } from "mongoose";

export type TMessage = {
  conversationId?: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  isDeleted?: boolean;
};
