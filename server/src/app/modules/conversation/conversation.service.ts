import mongoose from "mongoose";
import { Conversation } from "./conversation.model";
import { User } from "../user/user.model";
import { ObjectId } from "mongodb";
import { JwtPayload } from "jsonwebtoken";

const getConversationFromDB = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await Conversation.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(conversationId),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "messages",
      },
    },
    {
      $addFields: {
        participants: {
          $filter: {
            input: "$participants",
            as: "participant",
            cond: {
              $ne: ["$$participant", new mongoose.Types.ObjectId(userId)],
            },
          },
        },
        messages: {
          $reverseArray: "$messages",
        },
      },
    },
    {
      $unwind: "$messages",
    },
    {
      $sort: {
        "messages.createdAt": 1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "reciverProfile",
      },
    },
    {
      $unwind: "$reciverProfile",
    },
    {
      $group: {
        _id: "$_id",
        messages: { $push: "$messages" },
        reciverProfile: { $first: "$reciverProfile" },
      },
    },
    {
      $project: {
        _id: 1,
        messages: {
          _id: 1,
          conversationId: 1,
          isDeleted: 1,
          isEdited: 1,
          senderId: 1,
          receiverId: 1,
          text: 1,
          isSeen: 1,
          isRemove: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        reciverProfile: 1,
      },
    },
  ]);
  return conversation[0];
};

const getConversationsFromDB = async (currentUser: JwtPayload) => {
  const conversations = await User.aggregate([
    {
      $match: {
        email: currentUser.email,
      },
    },
    {
      $lookup: {
        from: "conversations",
        localField: "conversation",
        foreignField: "_id",
        as: "conversation",
      },
    },
    {
      $addFields: {
        conversation: {
          $map: {
            input: "$conversation",
            as: "conv",
            in: {
              _id: "$$conv._id",
              participants: {
                $filter: {
                  input: "$$conv.participants",
                  as: "participant",
                  cond: {
                    $ne: ["$$participant", new ObjectId(currentUser._id)],
                  },
                },
              },
              messages: "$$conv.messages",
              __v: "$$conv.__v",
            },
          },
        },
      },
    },
    {
      $unwind: "$conversation",
    },
    {
      $unwind: "$conversation.participants",
    },
    {
      $lookup: {
        from: "users",
        localField: "conversation.participants",
        foreignField: "_id",
        as: "conversation.participantDetails",
      },
    },
    {
      $unwind: "$conversation.participantDetails",
    },
    {
      $lookup: {
        from: "messages",
        localField: "conversation.messages",
        foreignField: "_id",
        as: "conversation.messages",
      },
    },
    {
      $addFields: {
        "conversation.messages": {
          $sortArray: {
            input: "$conversation.messages",
            sortBy: { createdAt: -1 },
          },
        },
      },
    },
    {
      $addFields: {
        "conversation.lastMessage": {
          $arrayElemAt: ["$conversation.messages", 0],
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        firstName: { $first: "$firstName" },
        lastName: { $first: "$lastName" },
        imgURL: { $first: "$imgURL" },
        email: { $first: "$email" },
        password: { $first: "$password" },
        lastSeen: { $first: "$lastSeen" },
        conversation: { $push: "$conversation" },
        isDeleted: { $first: "$isDeleted" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
    {
      $project: {
        conversation: {
          _id: 1,
          participantDetails: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            imgURL: 1,
          },
          lastMessage: {
            _id: 1,
            senderId: 1,
            text: 1,
            createdAt: 1,
            conversationId: 1,
          },
        },
        isDeleted: 1,
      },
    },
  ]);
  return conversations[0];
};

export const ConversationServices = {
  getConversationFromDB,
  getConversationsFromDB,
};
