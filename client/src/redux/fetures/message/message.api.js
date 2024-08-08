import { baseApi } from "../../api/baseApi";
import { conversationApi } from "../conversation/conversation.api";
import { toast } from "sonner";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: `/messages/${payload.receiverId}`,
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
                  text: messageData.text,
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
          getAllConversationPatchResult.undo();
          getConversationPatchResult.undo();
          toast.error("Internal server error");
        }
      },
      invalidatesTags: ["Conversation"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useSendMessageMutation, useDeleteMessageMutation } = messageApi;
