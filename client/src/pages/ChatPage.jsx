import { useEffect } from "react";
import ChatBox from "../components/chatBox/ChatBox";
import ChatSidebar from "../components/ChatSidebar";
import { socket } from "../socket";

export default function ChatPage() {
  // socket listener
  useEffect(() => {
    const handleDisconnect = (data) => {
      console.log(data);
    };

    socket.on("disconnectUser", handleDisconnect);

    return () => {
      socket.off("disconnectUser", handleDisconnect);
    };
  }, []);
  return (
    <div className=" w-[1400px] mx-auto flex ">
      <div className="w-[30%] h-screen bg-[#f5f1f1]">
        <ChatSidebar />
      </div>
      <div className=" w-[70%] h-screen ">
        <ChatBox />
      </div>
    </div>
  );
}
