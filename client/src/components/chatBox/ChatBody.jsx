/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useDeleteMessageMutation } from "../../redux/fetures/message/message.api";
import { formatMessageTime } from "../../utils/formatMessageTime";
import { formatHourMinute } from "../../utils/formatHourMinute";
import Tippy from "@tippyjs/react";
import { FaRegEdit } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { BsReply } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function ChatBody({
  conversationUser,
  conversationId,
  conversationData,
  isConversationDataLoading,
  reciverProfile,
}) {
  const containerRef = useRef(null);
  const [deleteMessage] = useDeleteMessageMutation();
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() =>
      toast
        .success("Copied", {
          duration: 1000,
          position: "bottom-right",
          className: "custom-toast",
        })
        .catch((err) => {
          console.log(err);
        })
    );
  };

  const handleMessageEdit = () => {};

  const handleMessageDelete = (id) => {
    deleteMessage(id);
  };
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [conversationData]);

  const elementRef = useRef(null); // Create a ref to the element
  const [height, setHeight] = useState(0); // State to store the height

  useEffect(() => {
    if (elementRef.current) {
      setHeight(elementRef.current.offsetHeight); // Get the height of the element
    }
  }, []); //
  console.log(height);

  if (isConversationDataLoading) {
    return (
      <div className=" h-[calc(100vh-135px)] custom-scrollbar overflow-y-scroll py-2 px-4">
        loading...
      </div>
    );
  }

  return (
    <div>
      {/*add new conversation ui  */}
      {conversationUser && !conversationId && (
        <div
          ref={containerRef}
          className=" h-[calc(100vh-135px)] custom-scrollbar overflow-y-scroll py-2 px-4"
        ></div>
      )}

      {/*existing conversation ui  */}
      {conversationId && !conversationUser && (
        <div
          ref={containerRef}
          className={`h-[calc(100vh-135px-${height}px)] custom-scrollbar overflow-y-scroll py-2 px-4`}
        >
          {conversationData?.data?.messages?.map((message) => {
            return (
              <div key={message._id}>
                <div className="text-center text-gray-600 text-sm">
                  {formatMessageTime(message.createdAt)}
                </div>
                <div
                  className={`flex ${
                    user?._id == message?.senderId && "justify-end"
                  } `}
                >
                  <div
                    className={`${
                      user?._id == message?.senderId
                        ? "bg-[#8FEABC] text-black"
                        : "bg-gray-100 text-black"
                    } py-[6px] pl-4 pr-16 mt-1 max-w-[50%] rounded-lg relative flex group`}
                  >
                    <p>{message.text}</p>
                    <p className="absolute text-[10px] bottom-[3px] text-gray-500 right-2 ">
                      {formatHourMinute(message.createdAt)}
                    </p>
                    <Tippy
                      content={
                        <div className="bg-white rounded text-xs w-[175px]">
                          <button
                            onClick={() => handleMessageEdit()}
                            className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                          >
                            <span>
                              <FaRegEdit />
                            </span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => copyToClipboard(message.text)}
                            className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                          >
                            <span>
                              <MdContentCopy />
                            </span>
                            <span>Copy</span>
                          </button>
                          <button className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start">
                            <span>
                              <BsReply className="text-[17px]" />
                            </span>
                            <span>Reply</span>
                          </button>
                          <button
                            onClick={() => {
                              handleMessageDelete(message._id);
                            }}
                            className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                          >
                            <span>
                              <RiDeleteBin6Line />
                            </span>
                            <span>Delete for me</span>
                          </button>
                          <button
                            onClick={() => {
                              handleMessageDelete(message._id);
                            }}
                            className="flex items-center gap-1 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full rounded text-start"
                          >
                            <span>
                              <RiDeleteBin6Line />
                            </span>
                            <span>Delete for everyone</span>
                          </button>
                        </div>
                      }
                      interactive={true}
                      placement={`${
                        user?._id == message?.senderId ? "left" : "right"
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
                          user?._id == message?.senderId
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* edit message  */}
      <div
        ref={elementRef}
        className=" bg-white break-words text-sm px-4 py-2 ml-4"
      >
        dslfksdflgOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
      </div>
    </div>
  );
}
