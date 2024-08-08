/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { catchAsync } from "../../utils/createAsync";
import sendResponse from "../../utils/sendResponse";
import { ConversationServices } from "./conversation.service";

const getConversation = catchAsync(async (req, res, next) => {
  const conversationId = req.params.id;
  const userId = req.user._id;
  const result = await ConversationServices.getConversationFromDB(
    conversationId,
    userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive conversation successfully!",
    data: result,
  });
});

const getConversations = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const result = await ConversationServices.getConversationsFromDB(currentUser);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrive conversations successfully!",
    data: result,
  });
});

export const ConversationControllers = {
  getConversation,
  getConversations,
};
