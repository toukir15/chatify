import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.JWT_SECRET_KEY,
  refresh_secret_key: process.env.REFRESH_SECRET_KEY,
  refresh_expire_in: process.env.REFRESH_EXPIRE_IN,
  access_secret_key: process.env.ACCESS_SECRET_KEY,
  access_expire_in: process.env.ACCESS_EXPIRE_IN,
};
