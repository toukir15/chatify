import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import bcrypt from "bcryptjs";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import config from "../../config";
import { TJWTPayload } from "./auth.interface";
import { genarateToken } from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";

const login = async (payload: Partial<TUser>) => {
  const user = await User.findOne({ email: payload.email });

  //   check if the user not exist
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Enter wrong credential");
  }

  //check user delete status
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already deleted");
  }

  //password check by bcryptjs compare func
  const isValidPassword = bcrypt.compareSync(
    payload.password as string,
    user.password
  );

  // check password
  if (!isValidPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Enter wrong credential");
  }

  const JWTPayload: TJWTPayload = {
    _id: user._id,
    email: user.email,
  };

  // genarate refresh token
  const refreshToken = genarateToken(
    JWTPayload,
    config.refresh_secret_key as string,
    config.refresh_expire_in as string
  );

  // genarate access token
  const accessToken = genarateToken(
    JWTPayload,
    config.access_secret_key as string,
    config.access_expire_in as string
  );
  return { refreshToken, accessToken };
};

const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.refresh_secret_key as string
  ) as JwtPayload;

  const user = await User.findById(decoded._id);

  //   check if the user not exist
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "Enter wrong credential");
  }

  //check user delete status
  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already deleted");
  }

  const JWTPayload: TJWTPayload = {
    _id: user._id,
    email: user.email,
  };

  // genarate access token
  const accessToken = genarateToken(
    JWTPayload,
    config.access_secret_key as string,
    config.access_expire_in as string
  );

  return { accessToken };
};

export const AuthServices = {
  login,
  refreshToken,
};
