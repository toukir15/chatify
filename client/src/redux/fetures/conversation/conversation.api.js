import { socket } from "../../../socket";
import { baseApi } from "../../api/baseApi";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversations: builder.query({
      query: () => {
        return {
          url: "/conversations",
          method: "GET",
        };
      },
      providesTags: ["Conversation"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const handleConversation = (data) => {
            updateCachedData((draft) => {
              const findConversation = draft.data.conversation.find(
                (conv) => conv._id === data.conversationId
              );
              if (findConversation) {
                findConversation.lastMessage.text = data.text;
                findConversation.lastMessage.createdAt = data.timestamp;
              }
              return draft;
            });
          };
          socket.on("conversation", handleConversation);
        } catch (error) {
          console.log(error);
        }
        // Cleanup steps once the `cacheEntryRemoved` promise resolves
        await cacheEntryRemoved;
      },
    }),
    getConversation: builder.query({
      query: (id) => {
        return {
          url: `/conversations/${id}`,
          method: "GET",
        };
      },
      providesTags: ["Conversation"],
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          // Wait for the initial query to resolve before proceeding
          await cacheDataLoaded;
          const handleMessage = (data) => {
            updateCachedData((draft) => {
              const id = Math.floor(Math.random() * 20);
              const newMessage = {
                _id: id,
                senderId: data.senderId,
                text: data.text,
                isSeen: data.isSeen,
                isRemove: data.isRemove,
                reply: data.reply,
                isDeleted: false,
                createdAt: data.timestamp,
              };
              draft.data.messages.push(newMessage);
            });
          };
          const handleDeleteForEveryone = (data) => {
            updateCachedData((draft) => {
              const findDeleteForEveryoneMessage = draft.data.messages.find(
                (message) => message._id == data._id
              );
              if (findDeleteForEveryoneMessage) {
                findDeleteForEveryoneMessage.isDeleted = true;
              }
              return draft;
            });
          };

          // Listen for 'sendMessage' events
          socket.on("message", handleMessage);
          socket.on("deleteForEveryone", handleDeleteForEveryone);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        // Cleanup steps once the `cacheEntryRemoved` promise resolves
        await cacheEntryRemoved;
      },
    }),
  }),
});

export const { useGetAllConversationsQuery, useGetConversationQuery } =
  conversationApi;
