import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import httpStatus from "http-status";

export const auth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization;
  let decoded;
  try {
    decoded = jwt.verify(token as string, config.access_secret_key as string);
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED");
  }
  req.user = decoded as JwtPayload;
  next();
};
