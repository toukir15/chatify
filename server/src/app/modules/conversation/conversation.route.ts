import { Router } from "express";
import { ConversationControllers } from "./conversation.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.get("/:id", auth, ConversationControllers.getConversation);
router.get("/", auth, ConversationControllers.getConversations);

export const ConversationRoutes = router;
