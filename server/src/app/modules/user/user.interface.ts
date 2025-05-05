import { Types } from "mongoose";

export type TUser = {
  name: string;
  password: string;
  imgURL: string;
  email: string;
  lastSeen?: string;
  conversation?: [Types.ObjectId];
  isDeleted?: false;
};
