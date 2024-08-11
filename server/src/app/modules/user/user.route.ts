import { Router } from "express";
import { UserControllers } from "./user.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/", auth, UserControllers.getUsers);
router.post("/", UserControllers.createUser);
router.patch("/", UserControllers.updateUser);

export const UserRoutes = router;
