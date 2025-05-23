/* eslint-disable react/prop-types */
import { formatLastSeen } from "../../utils/formatLastSeen";
import profile from "../../../public/toukir.jpg"

export default function ChatHeader({
  conversationUser,
  conversationId,
  reciverProfile,
  findOnlineReciverProfile,
  isTyping,
}) {
  return (
    <div>
      {/*add new conversation user profile */}
      {conversationUser && !conversationId && (
        <div className="bg-[#F5F1F1] px-8 py-3 flex items-center gap-4">
          <img
            className="w-14 h-14 rounded-full"
            src={profile}
            alt=""
          />
          <div>
            <p className="font-medium">
              {` ${conversationUser.name}`}
            </p>
            <p className="text-sm text-gray-500">
              {formatLastSeen(conversationUser.lastSeen)}
            </p>
          </div>
        </div>
      )}
      {/* existing conversation user profile  */}
      {conversationId && !conversationUser && (
        <div className="bg-[#F5F1F1] px-8 py-3 flex items-center gap-4">
          <img
            className="w-14 h-14 rounded-full"
            src={profile}
            alt=""
          />
          <div>
            <p className="font-medium">
              {`
            ${reciverProfile.name}`}
            </p>
            {findOnlineReciverProfile && !isTyping && (
              <p className="text-sm">online</p>
            )}
            {!findOnlineReciverProfile && (
              <p className="text-sm text-gray-500">
                {formatLastSeen(reciverProfile.lastSeen)}
              </p>
            )}
            {isTyping && <p className="text-sm text-gray-500">Typing...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
