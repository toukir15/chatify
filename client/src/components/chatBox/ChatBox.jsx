import { useSelector } from "react-redux";
import { useGetConversationQuery } from "../../redux/fetures/conversation/conversation.api";
import { useEffect, useRef, useState } from "react";
import logo from "/chat.png";
import { socket } from "../../socket";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useSeenMessageMutation } from "../../redux/fetures/message/message.api";

export default function ChatBox() {
  const [isTyping, setIsTyping] = useState(false);
  const conversationId = useSelector(
    (state) => state.conversation.conversationId
  );
  const [socketOnlineUsers, setSocketOnlineUsers] = useState([]);
  const [seenMessage] = useSeenMessageMutation();
  const messageBoxRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const conversationUser = useSelector((state) => state.user.conversationUser);
  const { data: conversationData, isLoading: isConversationDataLoading } =
    useGetConversationQuery(conversationId);

  const reciverProfile = conversationData?.data.reciverProfile;
  const findOnlineReciverProfile = socketOnlineUsers.find(
    (onlineUser) => onlineUser?._id === reciverProfile?._id
  );

  // socket listener
  useEffect(() => {
    const handleOnline = (data) => {
      setSocketOnlineUsers(data);
    };

    const handleTyping = (data) => {
      setIsTyping(data.isTyping);
    };
    const handleMessage = (data) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            console.log("Message box is visible");
            console.log(data);
            seenMessage({
              conversationId: data.conversationId,
              senderId: data.senderId,
            });
          } else {
            console.log("Message box is not visible");
          }
        },
        { threshold: 0.1 }
      );

      if (messageBoxRef.current) {
        observer.observe(messageBoxRef.current);
      }
    };

    const handleDisconnect = (data) => {
      console.log(data);
    };

    // Send current active user
    socket.emit("getUser", { ...user, isOnline: true });

    // Add socket event listeners
    socket.on("online", handleOnline);
    socket.on("typing", handleTyping);
    socket.on("message", handleMessage);
    socket.on("disconnectUser", handleDisconnect);

    // Clean up the event listener on component unmount
    return () => {
      socket.off("online", handleOnline);
      socket.off("typing", handleTyping);
      socket.off("message", handleMessage);
      socket.off("disconnectUser", handleDisconnect);
    };
  }, [user]);

  return (
    <>
      {(conversationData || conversationUser) && (
        <div>
          {/* sender profile  */}
          <>
            <ChatHeader
              conversationUser={conversationUser}
              conversationId={conversationId}
              reciverProfile={reciverProfile}
              findOnlineReciverProfile={findOnlineReciverProfile}
              isTyping={isTyping}
            />
          </>

          {/* conversation body  */}
          <>
            <ChatBody
              conversationUser={conversationUser}
              conversationId={conversationId}
              conversationData={conversationData}
              reciverProfile={reciverProfile}
              isConversationDataLoading={isConversationDataLoading}
              messageBoxRef={messageBoxRef}
            />
          </>

          {/* send message  */}
          <>
            <ChatFooter
              conversationUser={conversationUser}
              conversationId={conversationId}
              conversationData={conversationData}
            />
          </>
        </div>
      )}
      {!conversationData && (
        <div className="w-full h-screen flex justify-center items-center flex-col">
          <img className="w-32" src={logo} alt="" />
          <h3 className="text-xl mt-2">Chatify for messaging</h3>
          <div className="mt-2 text-gray-500 text-center">
            <p>send and recive messages without keeping your phone online.</p>
            <p>
              Use chatify on up to linked devices and 1 phone at the same time.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
