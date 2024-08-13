import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    editMessage: null,
    replyMessage: null,
    messageBoxHeight: "calc(100vh - 135px)",
    scrollBottom: false,
  },
  reducers: {
    setEditMessage: (state, action) => {
      state.editMessage = action.payload;
    },
    setReplyMessage: (state, action) => {
      state.replyMessage = action.payload;
    },
    setMessageBoxHeight: (state, action) => {
      state.messageBoxHeight = action.payload;
    },
    setScrollBottom: (state, action) => {
      state.scrollBottom = action.payload;
    },
  },
});

export const {
  setEditMessage,
  setMessageBoxHeight,
  setReplyMessage,
  setScrollBottom,
} = messageSlice.actions;
export default messageSlice.reducer;
