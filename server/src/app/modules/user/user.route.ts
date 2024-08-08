import { Router } from "express";
import { UserControllers } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", auth, UserControllers.getUsers);
router.post("/", UserControllers.createUser);

export const UserRoutes = router;
