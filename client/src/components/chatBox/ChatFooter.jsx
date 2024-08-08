/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { useSendMessageMutation } from "../../redux/fetures/message/message.api";
import { socket } from "../../socket";
import { LuSendHorizonal } from "react-icons/lu";
import { useEffect, useState } from "react";
import { setConversationId } from "../../redux/fetures/conversation/conversation.slice";
import { setConversationUser } from "../../redux/fetures/user/user.slice";

export default function ChatFooter({
  conversationUser,
  conversationId,
  conversationData,
}) {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [sendMessage] = useSendMessageMutation();
  const reciverProfile = conversationData?.data.reciverProfile;
  const [messageEditData, setMessageEditData] = useState({
    text: "how are you",
  });
  const handleAddNewSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;
    const messageData = {
      senderId: user._id,
      text: messageText,
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
    e.target.message.value = "";
  };

  const handleExistingSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value;
    const messageData = {
      senderId: user._id,
      text: messageText,
    };
    const now = new Date();
    const timestamp = now.toISOString();
    const receiverId = reciverProfile._id;
    const response = await sendMessage({
      messageData,
      receiverId,
      conversationId,
    });
    if (response.data.success) {
      socket.emit("message", { ...messageData, receiverId, timestamp });
      socket.emit("conversation", {
        ...messageData,
        conversationId,
        receiverId,
        timestamp,
      });
      socket.emit("typing", { id: reciverProfile._id, isTyping: false });
    }
    e.target.message.value = "";
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
      {/*add new send message  */}
      {conversationUser && !conversationId && (
        <form
          onSubmit={handleAddNewSendMessage}
          className="pl-4 flex gap-3 relative "
        >
          <input
            onChange={(e) => setMessage(e.target.value)}
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

      {/* existing send message  */}
      {conversationId && !conversationUser && (
        <form
          onSubmit={handleExistingSendMessage}
          className="pl-4 flex gap-3 relative "
        >
          <input
            onChange={(e) => setMessage(e.target.value)}
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
