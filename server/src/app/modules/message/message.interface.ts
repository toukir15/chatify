import { Types } from "mongoose";

export interface TMessage {
  conversationId?: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  isSeen: {
    [key: string]: boolean;
  };
  isRemove: {
    [key: string]: boolean;
  };
  isDeleted?: boolean;
  isEdited?: boolean;
}

export interface TMessageDeleteQuery {
  isDeleted?: boolean;
  isRemove?: boolean;
}
