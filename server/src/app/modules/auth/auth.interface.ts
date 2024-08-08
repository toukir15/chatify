import { Types } from "mongoose";

export type TAuth = {
  _id: Types.ObjectId;
  email: string;
  iat: number;
  exp: number;
};

export type TJWTPayload = {
  _id: Types.ObjectId;
  email: string;
};
