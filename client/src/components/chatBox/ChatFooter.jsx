/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import {
  useEditMessageMutation,
  useSendMessageMutation,
} from "../../redux/fetures/message/message.api";
import { socket } from "../../socket";
import { LuSendHorizonal } from "react-icons/lu";
import { useEffect, useState } from "react";
import { setConversationId } from "../../redux/fetures/conversation/conversation.slice";
import { setConversationUser } from "../../redux/fetures/user/user.slice";
import {
  setEditMessage,
  setMessageBoxHeight,
} from "../../redux/fetures/message/message.slice";

export default function ChatFooter({
  conversationUser,
  conversationId,
  conversationData,
}) {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const editMessageData = useSelector((state) => state.message.editMessage);
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const reciverProfile = conversationData?.data.reciverProfile;

  // Update message state when editMessage changes
  useEffect(() => {
    if (editMessageData) {
      setMessage(editMessageData.text || "");
    } else {
      setMessage("");
    }
  }, [editMessageData]);

  const handleAddNewSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;
    const messageData = {
      senderId: user._id,
      text: messageText,
      receiverId: reciverProfile._id,
      isSeen: {
        [user._id]: false,
        [reciverProfile._id]: false,
      },
      isRemove: {
        [user._id]: false,
        [reciverProfile._id]: false,
      },
    };
    const receiverId = conversationUser._id;
    const response = await sendMessage({
      messageData,
      receiverId,
      conversationId,
    }).unwrap();
    const resConversationId = response.data.conversationId;
    dispatch(setConversationId(resConversationId));
    dispatch(setConversationUser(null));
    setMessage("");
  };

  const handleExistingSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;
    const messageData = {
      senderId: user._id,
      receiverId: reciverProfile._id,
      text: messageText,
      isSeen: {
        [user._id]: false,
        [reciverProfile._id]: false,
      },
      isRemove: {
        [user._id]: false,
        [reciverProfile._id]: false,
      },
    };
    const now = new Date();
    const timestamp = now.toISOString();
    const receiverId = reciverProfile._id;
    const response = await sendMessage({
      messageData,
      receiverId,
      conversationId,
    });
    if (response.data?.success) {
      socket.emit("message", { ...messageData, receiverId, timestamp });
      socket.emit("conversation", {
        ...messageData,
        conversationId,
        receiverId,
        timestamp,
      });
      socket.emit("typing", { id: reciverProfile._id, isTyping: false });
    }
    setMessage("");
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;
    editMessage({
      _id: editMessageData._id,
      message: messageText,
      conversationId: editMessageData.conversationId,
    });
    dispatch(setMessageBoxHeight("calc(100vh - 135px)"));
    dispatch(setEditMessage(null));
    setMessage("");
  };

  useEffect(() => {
    if (reciverProfile) {
      socket.emit("typing", {
        id: reciverProfile._id,
        isTyping: message.length > 0,
      });
    }
  }, [message, reciverProfile]);

  return (
    <div>
      {/* Add new send message */}
      {conversationUser && !conversationId && (
        <form
          onSubmit={handleAddNewSendMessage}
          className="pl-4 flex gap-3 relative"
        >
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message} // Use controlled input
            type="text"
            required
            name="message"
            placeholder="Type a message"
            className="border w-full py-3 rounded pl-4 outline-none text-sm"
          />
          <button className="absolute right-3 top-0 translate-y-1 text-[22px] text-gray-500 px-3 py-2 hover:bg-gray-100 transition-all ">
            <LuSendHorizonal />
          </button>
        </form>
      )}

      {/* Existing send message */}
      {conversationId && !conversationUser && !editMessageData && (
        <form
          onSubmit={handleExistingSendMessage}
          className="pl-4 flex gap-3 relative"
        >
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message} // Use controlled input
            type="text"
            required
            name="message"
            placeholder="Type a message"
            className="border w-full py-3 rounded pl-4 outline-none text-sm"
          />
          <button className="absolute right-3 top-0 translate-y-1 text-[22px] text-gray-500 px-3 py-2 hover:bg-gray-100 transition-all ">
            <LuSendHorizonal />
          </button>
        </form>
      )}

      {/* Edit send message */}
      {editMessageData && (
        <form onSubmit={handleEditMessage} className="pl-4 flex gap-3 relative">
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message} // Use controlled input
            type="text"
            required
            name="message"
            placeholder="Type a message"
            className="border w-full py-3 rounded pl-4 outline-none text-sm"
          />
          <button className="absolute right-3 top-0 translate-y-1 text-[22px] text-gray-500 px-3 py-2 hover:bg-gray-100 transition-all ">
            <LuSendHorizonal />
          </button>
        </form>
      )}
    </div>
  );
}
