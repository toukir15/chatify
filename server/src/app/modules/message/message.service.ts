import mongoose from "mongoose";
import { Conversation } from "../conversation/conversation.model";
import { User } from "../user/user.model";
import { TMessage, TMessageDeleteQuery } from "./message.interface";
import { Message } from "./message.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createMessageIntoDB = async (payload: TMessage) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save the message into the database
    const createMessage = await Message.create([payload], { session });

    // Check if a conversation with the same participants already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [createMessage[0].senderId, payload.receiverId] },
    }).session(session);

    // If no existing conversation, create a new one
    if (!conversation) {
      const [newConversation] = await Conversation.create(
        [
          {
            participants: [createMessage[0].senderId, payload.receiverId],
          },
        ],
        { session }
      );
      conversation = newConversation;

      // Update conversation IDs in the user collection
      await User.findByIdAndUpdate(
        createMessage[0].senderId,
        { $addToSet: { conversation: conversation._id } },
        { new: true, session }
      );

      await User.findByIdAndUpdate(
        payload.receiverId,
        { $addToSet: { conversation: conversation._id } },
        { new: true, session }
      );
    }

    // Update conversationId in the message collection
    const updateMessage = await Message.findByIdAndUpdate(
      createMessage[0]._id,
      { conversationId: conversation._id },
      { new: true, session }
    );

    // push message id into coversation collection
    await Conversation.findByIdAndUpdate(
      updateMessage?.conversationId,
      {
        $addToSet: { messages: updateMessage?._id },
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return updateMessage;
  } catch (error) {
    // Abort the transaction and rollback
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Provide inconsistant data");
  }
};

const deleteMessageFromDB = async (
  messageId: string,
  userId: string,
  query: TMessageDeleteQuery
) => {
  // check message exist or not
  const findMessage = await Message.findById(messageId);
  if (!findMessage) {
    throw new AppError(httpStatus.BAD_REQUEST, "Message does not exist!");
  }

  let queryOption;
  if (query?.isDeleted) {
    queryOption = { isDeleted: true };
  } else if (query?.isRemove) {
    queryOption = { [`isRemove.${userId}`]: true };
  }

  const result = await Message.findByIdAndUpdate(messageId, queryOption, {
    new: true,
  });
  return result;
};

const updateMessageIntoDB = async (messageId: string, newMessage: string) => {
  const result = await Message.findByIdAndUpdate(
    messageId,
    {
      text: newMessage,
      isEdited: true,
    },
    { new: true }
  );
  return result;
};

const updateSeenStatusIntoDB = async (
  conversationId: string,
  senderId: string
) => {
  const result = await Message.updateMany(
    { conversationId: conversationId, [`isSeen.${senderId}`]: { $ne: true } },
    { $set: { [`isSeen.${senderId}`]: true } }
  );
  console.log(result);
  return result;
};

export const MessageServices = {
  createMessageIntoDB,
  deleteMessageFromDB,
  updateMessageIntoDB,
  updateSeenStatusIntoDB,
};
