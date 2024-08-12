import { baseApi } from "../../api/baseApi";
import { conversationApi } from "../conversation/conversation.api";
import { toast } from "sonner";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: `/messages`,
        method: "POST",
        body: payload.messageData,
      }),
      async onQueryStarted(
        { messageData, conversationId },
        { queryFulfilled, dispatch }
      ) {
        // create current timestamp
        const now = new Date();
        const timestamp = now.toISOString();

        let getAllConversationPatchResult;
        let getConversationPatchResult;
        try {
          const response = await queryFulfilled;
          const responseMessageId = response.data.data._id;

          // update conversation last message
          getAllConversationPatchResult = dispatch(
            conversationApi.util.updateQueryData(
              "getAllConversations",
              undefined,
              (draft) => {
                const conversationsData = draft.data.conversation;
                const findCov = conversationsData.find(
                  (conversation) => conversation._id == conversationId
                );
                if (findCov) {
                  findCov.lastMessage.text = messageData.text;
                  findCov.lastMessage.createdAt = timestamp;
                  findCov.lastMessage._id = responseMessageId;
                }
                return draft;
              }
            )
          );

          // update messages cache
          getConversationPatchResult = dispatch(
            conversationApi.util.updateQueryData(
              "getConversation",
              conversationId,
              (draft) => {
                const messages = draft.data.messages;
                const newMessage = {
                  _id: "",
                  senderId: messageData.senderId,
                  receiverId: messageData.receiverId,
                  text: messageData.text,
                  isSeen: messageData.isSeen,
                  isRemove: messageData.isRemove,
                  isDeleted: false,
                  createdAt: timestamp,
                };

                // optemestic update cache >> push new message in cache
                draft.data.messages.push(newMessage);

                // Pessimistic Updates >> update _id after got response
                if (responseMessageId) {
                  messages[messages.length - 1]._id = responseMessageId;
                }
                return draft;
              }
            )
          );
        } catch (error) {
          getAllConversationPatchResult?.undo();
          getConversationPatchResult?.undo();
        }
      },
      invalidatesTags: ["Conversation"],
    }),
    deleteMessage: builder.mutation({
      query: (payload) => {
        const params = new URLSearchParams();
        if (payload?.isDeleted) {
          params.append("isDeleted", true);
        } else if (payload?.isRemove) {
          params.append("isRemove", true);
        }
        return {
          url: `/messages/${payload.message._id}?${params.toString()}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(payload, { queryFulfilled, dispatch }) {
        // let getConversationPatchResult;
        try {
          const result = await queryFulfilled;
          console.log(result);

          // Update messages cache
          dispatch(
            conversationApi.util.updateQueryData(
              "getConversation",
              payload.message.conversationId,
              (draft) => {
                const findDeleteForEveryoneMessage = draft.data.messages.find(
                  (message) => message._id == payload.message._id
                );
                if (result.data.data.isDeleted) {
                  findDeleteForEveryoneMessage.isDeleted = true;
                } else {
                  findDeleteForEveryoneMessage.isRemove[payload.userId] = true;
                }

                return draft;
              }
            )
          );
        } catch (error) {
          toast.error("Internal server error");
        }
      },
    }),
    editMessage: builder.mutation({
      query: (payload) => ({
        url: `/messages/${payload._id}`,
        method: "PATCH",
        body: { newMessage: payload.message },
      }),
      async onQueryStarted(payload, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          // Update messages cache
          dispatch(
            conversationApi.util.updateQueryData(
              "getConversation",
              payload.conversationId,
              (draft) => {
                const findEditedMessage = draft.data.messages.find(
                  (message) => message._id == payload._id
                );
                if (findEditedMessage) {
                  findEditedMessage.isEdited = true;
                  findEditedMessage.text = payload.message;
                }
                return draft;
              }
            )
          );
        } catch (error) {
          toast.error("Internal server error");
        }
      },
    }),
  }),
});

export const {
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
} = messageApi;
