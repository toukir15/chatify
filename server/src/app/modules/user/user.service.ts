import mongoose from "mongoose";
import config from "../../config";
import { TUser } from "./user.interface";
import bcrypt from "bcryptjs";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
const { ObjectId } = mongoose.Types;

const createUserIntoDB = async (payload: TUser) => {
  const salt = bcrypt.genSaltSync(Number(config.bcrypt_salt_round));
  const hash = bcrypt.hashSync(payload?.password, salt);
  const result = await User.create({ ...payload, password: hash });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...resultObj } = result.toObject();
  return resultObj;
};

const getUsersFromDB = async (userId: string) => {
  const result = await User.find({ _id: { $ne: new ObjectId(userId) } }).select(
    { _id: 1, firstName: 1, lastName: 1, imgURL: 1, email: 1, lastSeen: 1 }
  );
  return result;
};

const updateUserIntoDB = async (userId: string) => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!");
  }
  const now = new Date();
  const timestamp = now.toISOString();
  const result = await User.findByIdAndUpdate(
    userId,
    { lastSeen: timestamp },
    { new: true }
  );
  return result;
};

export const userServices = {
  createUserIntoDB,
  getUsersFromDB,
  updateUserIntoDB,
};
