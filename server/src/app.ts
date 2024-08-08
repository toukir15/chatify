import express from "express";
export const app = express();
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

// express middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// application route starting point
app.use("/api/v1", router);

// global error handler
app.use(globalErrorHandler);

// Api not found
app.use(notFound);
