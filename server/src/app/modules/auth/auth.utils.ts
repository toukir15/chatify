import jwt from "jsonwebtoken";
import { TJWTPayload } from "./auth.interface";

export const genarateToken = (
  payload: TJWTPayload,
  secretKey: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secretKey, { expiresIn: expiresIn });
};
