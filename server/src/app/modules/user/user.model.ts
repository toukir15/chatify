import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    lastSeen: { type: Date, default: Date.now() },
    conversation: { type: [Schema.Types.ObjectId] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<TUser>("user", userSchema);
