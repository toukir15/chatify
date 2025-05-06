import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);
router.get("/verify-token", AuthControllers.verifyToken);

export const AuthRoutes = router;
