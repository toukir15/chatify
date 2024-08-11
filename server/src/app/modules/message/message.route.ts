import { Router } from "express";
import { MessageControllers } from "./message.controller";

const router = Router();

router.post("/", MessageControllers.createMessage);
router.delete("/:messageId", MessageControllers.deleteMessage);
router.patch("/:messageId", MessageControllers.updateMessage);

export const MessageRoutes = router;
