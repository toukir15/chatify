/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDeleteMessageMutation } from "../../redux/fetures/message/message.api";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { formatHourMinute } from "../../utils/formatHourMinute";
import Tippy from "@tippyjs/react";
import { FaRegEdit } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  setEditMessage,
  setMessageBoxHeight,
  setReplyMessage,
} from "../../redux/fetures/message/message.slice";
import { MdModeEdit } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { HiMiniNoSymbol } from "react-icons/hi2";
import { socket } from "../../socket";

export default function ChatBody({
  conversationUser,
  conversationId,
  conversationData,
  isConversationDataLoading,
  reciverProfile,
  messageBoxRef,
}) {
  const replyBoxRef = useRef(null);
  const editBoxRef = useRef();
  const dispatch = useDispatch();
  const [deleteMessage] = useDeleteMessageMutation();
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const editMessage = useSelector((state) => state.message.editMessage);
  const replyMessage = useSelector((state) => state.message.replyMessage);
  const scrollBottom = useSelector((state) => state.message.scrollBottom);
  const user = useSelector((state) => state.auth.user);
  const messageBoxHeight = useSelector(
    (state) => state.message.messageBoxHeight
  );

  // message copy fn
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast.success("Copied", {
          duration: 1000,
          position: "bottom-right",
          className: "custom-toast",
        })
      )
      .catch((err) => {
        console.log(err);
      });
  };

  // message edit fn
  const handleMessageEdit = (data) => {
    dispatch(setEditMessage(data));
    dispatch(setReplyMessage(null));
  };

  // message delete fn
  const handleDeleteForEveryone = (message) => {
    deleteMessage({ message, isDeleted: true });
    socket.emit("deleteForEveryone", message);
  };

  // message delete for me fn
  const handleDeleteForMe = (message) => {
    deleteMessage({ message, userId: user._id, isRemove: true });
  };

  // message reply fn
  const handleMessageReply = (data) => {
    dispatch(setReplyMessage(data));
    dispatch(setEditMessage(null));
  };

  // message reply close fn
  const handleReplyClose = useCallback(() => {
    dispatch(setReplyMessage(null));
    dispatch(setMessageBoxHeight("calc(100vh - 135px)"));
  }, []);

  const handleEditClose = useCallback(() => {
    dispatch(setEditMessage(null));
    dispatch(setMessageBoxHeight("calc(100vh - 135px)"));
  }, [dispatch]);

  // intially scroll bottom
  useEffect(() => {
    const messageBox = messageBoxRef.current;
    if (messageBox) {
      setTimeout(() => {
        messageBox.scrollTo({
          top: messageBox.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [scrollBottom]);

  useEffect(() => {
    const replyBox = replyBoxRef.current;
    const messageBox = messageBoxRef.current;

    if (replyBox && messageBox) {
      const handleResize = () => {
        const replyBoxHeight = replyBox.clientHeight;
        const newChatHeight = `calc(100vh - ${135 + replyBoxHeight}px)`;
        dispatch(setMessageBoxHeight(newChatHeight));
      };

      if (replyMessage) {
        handleResize();
      } else {
        dispatch(setMessageBoxHeight("calc(100vh - 135px)"));
      }

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [replyMessage]);

  useEffect(() => {
    const editBox = editBoxRef.current;
    const messageBox = messageBoxRef.current;

    if (editBox && messageBox) {
      const handleResize = () => {
        const editBoxHeight = editBox.clientHeight;
        const newEditBoxheight = `calc(100vh - ${135 + editBoxHeight}px)`;
        dispatch(setMessageBoxHeight(newEditBoxheight));
      };

      if (editBox) {
        handleResize();
      } else {
        dispatch(setMessageBoxHeight("calc(100vh - 135px)"));
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [editMessage]);

  if (isConversationDataLoading) {
    return (
      <div className="h-[calc(100vh-135px)] custom-scrollbar overflow-y-scroll py-2 px-4">
        loading...
      </div>
    );
  }

  return (
    <div>
      {/* Add new conversation UI */}
      {conversationUser && !conversationId && (
        <div
          ref={messageBoxRef}
          className="h-[calc(100vh-135px)] custom-scrollbar overflow-y-scroll py-2 px-4"
        ></div>
      )}

      {/* Existing conversation UI */}
      {conversationId && !conversationUser && (
        <div
          ref={messageBoxRef}
          style={{ height: messageBoxHeight }}
          className="custom-scrollbar overflow-y-scroll py-2 px-16"
        >
          {conversationData?.data?.messages?.map((message) => {
            const {
              senderId,
              createdAt,
              isDeleted,
              isEdited,
              text,
              isSeen,
              isRemove,
              reply,
              _id,
            } = message;
            const findReply = conversationData?.data?.messages?.find(
              (message) => message._id == reply
            );

            return (
              <div key={_id} data-id={text}>
                {!isRemove[user?._id] && (
                  <div>
                    <div className="text-center text-gray-600 text-sm">
                      {formatMessageTime(createdAt)}
                    </div>

                    {/* message start  */}
                    <div
                      className={`flex ${
                        user?._id === senderId && "justify-end"
                      } `}
                    >
                      <div
                        className={`${
                          user?._id === senderId
                            ? "bg-[#8FEABC] text-black"
                            : "bg-gray-100 text-black"
                        } py-[6px]   mt-1 max-w-[52%] rounded-lg relative flex group`}
                      >
                        {/* message text  */}
                        {!isDeleted && (
                          <div>
                            {findReply && (
                              <div
                                className={`border-l-4 ${
                                  findReply?.senderId == user._id
                                    ? "border-l-green-400"
                                    : "border-l-sky-400"
                                }  pl-2 pr-2 py-1 text-xs bg-[#e3e5e1d0] rounded flex justify-between mx-2 cursor-pointer`}
                              >
                                <div>
                                  <p
                                    className={`${
                                      findReply?.senderId == user._id
                                        ? "text-green-600"
                                        : "text-sky-400"
                                    } `}
                                  >
                                    {findReply?.senderId == user._id
                                      ? "You"
                                      : reciverProfile?.firstName +
                                        " " +
                                        reciverProfile?.lastName}
                                  </p>
                                  <p className="text-gray-600">
                                    {findReply?.text}
                                  </p>
                                </div>
                              </div>
                            )}
                            <p
                              className={`${
                                user?._id === senderId
                                  ? isEdited && !isDeleted
                                    ? "pr-[120px]"
                                    : "pr-[86px]"
                                  : "pr-16"
                              } pl-2 `}
                            >
                              {text}
                            </p>
                          </div>
                        )}

                        {/* deleted status  */}
                        {isDeleted && (
                          <p className="text-gray-500 flex items-center py-[2px] gap-1 ml-2 mr-16">
                            <span>
                              <HiMiniNoSymbol />
                            </span>
                            <span className="text-sm">
                              {`${
                                user?._id === senderId
                                  ? "You "
                                  : `${reciverProfile?.firstName} `
                              }`}
                              deleted this message.
                            </span>
                          </p>
                        )}

                        <div className="flex">
                          {/* edited status  */}
                          {isEdited && !isDeleted && (
                            <p
                              className={`absolute ${
                                user?._id === senderId && !isDeleted
                                  ? "right-[80px]"
                                  : "right-3"
                              } text-[10px] bottom-[3px] text-gray-500  `}
                            >
                              Edited
                            </p>
                          )}

                          {/* message time  */}
                          <p
                            className={`absolute ${
                              user?._id === senderId && !isDeleted
                                ? "right-[30px]"
                                : "right-3"
                            } text-[10px] bottom-[3px] text-gray-500  `}
                          >
                            {formatHourMinute(createdAt)}
                          </p>

                          {/* seen unseen status  */}
                          {user?._id === senderId && !isDeleted && (
                            <p
                              className={`absolute text-[17px] bottom-[3px] right-1 ${
                                isSeen[user._id]
                                  ? "text-blue-700"
                                  : "text-gray-500"
                              }`}
                            >
                              <IoCheckmarkDoneOutline />
                            </p>
                          )}
                        </div>

                        {/* message options  */}
                        {!isDeleted && (
                          <Tippy
                            content={
                              <div className="bg-white rounded text-xs w-[175px]">
                                {(message.senderId == user._id ||
                                  message.isSeen[user._id]) && (
                                  <button
                                    onClick={() => handleMessageEdit(message)}
                                    className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                                  >
                                    <span>
                                      <FaRegEdit />
                                    </span>
                                    <span>Edit</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => copyToClipboard(message.text)}
                                  className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                                >
                                  <span>
                                    <MdContentCopy />
                                  </span>
                                  <span>Copy</span>
                                </button>
                                <button
                                  onClick={() => handleMessageReply(message)}
                                  className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                                >
                                  <span>
                                    <BsReply className="text-[17px]" />
                                  </span>
                                  <span>Reply</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteForMe(message);
                                  }}
                                  className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                                >
                                  <span>
                                    <RiDeleteBin6Line />
                                  </span>
                                  <span>Delete for me</span>
                                </button>
                                {message.senderId == user._id && (
                                  <button
                                    onClick={() => {
                                      handleDeleteForEveryone(message);
                                    }}
                                    className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                                  >
                                    <span>
                                      <RiDeleteBin6Line />
                                    </span>
                                    <span>Delete for everyone</span>
                                  </button>
                                )}
                              </div>
                            }
                            interactive={true}
                            placement={`${
                              user?._id === message?.senderId ? "left" : "right"
                            }`}
                            trigger="click"
                            arrow={true}
                            theme="custom-white-border"
                            onClickOutside={() => setIsOptionOpen(false)}
                            maxWidth="1000px"
                          >
                            <button
                              onClick={() => {
                                setSelectedMessageId(message._id);
                                setIsOptionOpen(!isOptionOpen);
                              }}
                              className={`absolute ${
                                user?._id === message?.senderId
                                  ? "-left-9"
                                  : "-right-9"
                              }  bottom-1 opacity-0 ${
                                selectedMessageId === message._id &&
                                isOptionOpen &&
                                "opacity-100"
                              } group-hover:opacity-100 hover:bg-[#f4f4f4d3] p-[7px] rounded-full transition duration-200`}
                            >
                              <HiOutlineDotsVertical />
                            </button>
                          </Tippy>
                        )}
                      </div>
                    </div>
                    {/* message end  */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Reply message */}
      {replyMessage && (
        <div
          ref={replyBoxRef}
          className="bg-white rounded-t text-sm px-4 py-2 ml-4"
        >
          <div
            className={`border-l-4 ${
              replyMessage.senderId == user._id
                ? "border-l-green-500"
                : "border-l-sky-400"
            }  pl-2 pr-2 py-1 text-xs bg-gray-100 rounded flex justify-between`}
          >
            <div>
              <p
                className={`${
                  replyMessage.senderId == user._id
                    ? "text-green-500"
                    : "text-sky-400"
                } `}
              >
                {replyMessage.senderId == user._id
                  ? "You"
                  : reciverProfile.firstName + " " + reciverProfile.lastName}
              </p>
              <p className="text-gray-600">{replyMessage?.text}</p>
            </div>
            <button
              onClick={handleReplyClose}
              className="text-xl hover:text-gray-700"
            >
              <IoIosCloseCircleOutline />
            </button>
          </div>
        </div>
      )}

      {/* edit message  */}
      {editMessage && (
        <div
          ref={editBoxRef}
          className="bg-white rounded-t text-sm px-4 py-2 ml-4"
        >
          <div
            className={`border-l-4  border-l-green-500 pl-2 pr-2 py-1 text-xs bg-gray-100 rounded flex justify-between`}
          >
            <div>
              <div className="flex items-center gap-1">
                <MdModeEdit className="text-[13px]" />
                <p className="text-green-500">You</p>
              </div>
              <p className="text-gray-600">{editMessage?.text}</p>
            </div>
            <button
              onClick={handleEditClose}
              className="text-xl hover:text-gray-700"
            >
              <IoIosCloseCircleOutline />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
