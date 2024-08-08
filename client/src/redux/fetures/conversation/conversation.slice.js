import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "coversation",
  initialState: {
    conversationId: null,
  },
  reducers: {
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
  },
});

export const { setConversationId } = conversationSlice.actions;
export default conversationSlice.reducer;
