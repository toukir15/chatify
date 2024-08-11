import { FaRegEdit } from "react-icons/fa";
import { useState } from "react";
import { calculateTime } from "../utils/CalculateTime";
import { useDispatch } from "react-redux";
import { setConversationId } from "../redux/fetures/conversation/conversation.slice";
import { useGetAllConversationsQuery } from "../redux/fetures/conversation/conversation.api";
import { useGetUsersQuery } from "../redux/fetures/user/user.api";
import { setConversationUser } from "../redux/fetures/user/user.slice";
import { socket } from "../socket";

export default function ChatSidebar() {
  // const [isSearchbarOnFocus, setIsSearchbarOnFocus] = useState(false);
  const dispatch = useDispatch();
  const [addNewOpen, setAddNewOpen] = useState(false);
  const { data: conversationsData } = useGetAllConversationsQuery(undefined);
  const { data: usersData } = useGetUsersQuery(undefined);

  // const handleOnFocus = () => {
  //   setIsSearchbarOnFocus(true);
  // };
  // const handleOnBlur = () => {
  //   setIsSearchbarOnFocus(false);
  // };

  const handleOnChage = (e) => {
    e.preventDefault();
  };

  const handleConversationId = (id) => {
    dispatch(setConversationId(id));
    dispatch(setConversationUser(null));
    socket.emit("online");
  };

  const handleConversationUser = (payload) => {
    dispatch(setConversationUser(payload));
    dispatch(setConversationId(null));
    socket.emit("online");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center relative">
        <h5 className="text-xl font-medium">Chats</h5>
        <button
          onClick={() => {
            setAddNewOpen(!addNewOpen);
          }}
          className="flex items-center gap-2 bg-green-700 text-white py-1 px-2 rounded "
        >
          <p>New</p>
          <FaRegEdit size={20} />
        </button>
        {/* add new list */}

        <div
          className={`absolute bg-white shadow-lg ${
            addNewOpen
              ? "top-10 block visible transition-all duration-500"
              : "-top-10 invisible"
          }  z-40 right-0 translate-x-[72%]  w-[270px] rounded h-[400px] px-3 pt-4`}
        >
          <div>
            <h3 className="text-xl font-medium">New Chat</h3>
            <input
              type="text"
              placeholder="Search name or email"
              className="border w-full my-2 py-[4px] px-[6px] outline-none rounded-t border-b-green-700 border-b-2 text-sm"
            />
          </div>

          {/* add user  */}
          <div>
            {usersData?.data.map((data) => {
              const { _id, imgURL, firstName, lastName } = data;
              return (
                <button
                  key={_id}
                  onClick={() => handleConversationUser(data)}
                  className="flex items-center gap-2 hover:bg-gray-100 w-full py-1 px-2 transition duration-300 "
                >
                  <img className="w-7 rounded-full" src={imgURL} alt="" />
                  <p className="font-medium text-gray-800">{`${firstName} ${lastName}`}</p>
                </button>
              );
            })}
          </div>

          {/* there are no user  */}
          {usersData?.data.length < 0 && (
            <h4 className="text-xl font-medium text-center mt-4 text-gray-400">
              There are no users!
            </h4>
          )}
        </div>
      </div>
      <form className="relative">
        <input
          // onFocus={() => handleOnFocus()}
          // onBlur={() => handleOnBlur()}
          onChange={handleOnChage}
          id="search"
          className="border w-full mt-4 py-2 px-4 rounded outline-none"
          placeholder="Search conversation"
          type="text"
        />
        {/* {isSearchbarOnFocus && (
          <div className=" bg-white rounded absolute w-full max-h-[400px] h-[500px] shadow-lg top-[65px] py-2">
            {usersData.data.map((data) => {
              return (
                <button
                  key={data.email}
                  className="flex items-center gap-2 hover:bg-gray-100 w-full py-1 px-4 transition duration-300 "
                >
                  <img
                    className="w-10 rounded-full"
                    src={data.profileUrl}
                    alt=""
                  />
                  <p className="font-medium text-gray-800">{data.name}</p>
                </button>
              );
            })}
          </div>
        )} */}
      </form>

      {/* chat list */}
      <div className="chatbox_scroll mt-6 overflow-y-scroll h-[810px]">
        {conversationsData?.data?.conversation
          ?.slice() // Create a shallow copy of the array
          .sort(
            (a, b) =>
              new Date(b.lastMessage.createdAt) -
              new Date(a.lastMessage.createdAt)
          )
          ?.map((conversation) => {
            const { firstName, lastName, imgURL } =
              conversation.participantDetails;
            const { text, createdAt } = conversation.lastMessage;
            return (
              <button
                key={conversation._id}
                onClick={() => handleConversationId(conversation._id)}
                className="flex items-center bg-white py-3 px-2 rounded border-b border-[#c5c5c5] w-full"
              >
                <div className="w-[20%]">
                  <img className="w-14 h-14 rounded-full" src={imgURL} alt="" />
                </div>
                <div className="w-[80%]">
                  <div className="flex justify-between w-full">
                    <p className="capitalize">{`${firstName} ${lastName}`}</p>
                    <p className="text-sm text-gray-500">
                      {calculateTime(createdAt)}
                    </p>
                  </div>
                  <p className="text-sm text-start">
                    {text.slice(0, 25)} {text.length > 25 && "..."}{" "}
                  </p>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
