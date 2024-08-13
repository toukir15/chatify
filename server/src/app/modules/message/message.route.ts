import { Router } from "express";
import { MessageControllers } from "./message.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", MessageControllers.createMessage);
router.delete("/:messageId", auth, MessageControllers.deleteMessage);
router.patch("/:messageId", MessageControllers.updateMessage);
router.patch(
  "/seen/:conversationId/:senderId",
  auth,
  MessageControllers.updateSeenStatus
);

export const MessageRoutes = router;
