import ChatBox from "../components/chatBox/ChatBox";
import ChatSidebar from "../components/ChatSidebar";

export default function ChatPage() {
  return (
    <div className=" w-[1300px] mx-auto flex ">
      <div className="w-[30%] h-screen bg-[#f5f1f1]">
        <ChatSidebar />
      </div>
      <div className=" w-[70%] h-screen ">
        <ChatBox />
      </div>
    </div>
  );
}
