import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    editMessage: null,
    messageBoxHeight: "calc(100vh - 135px)",
  },
  reducers: {
    setEditMessage: (state, action) => {
      state.editMessage = action.payload;
    },
    setMessageBoxHeight: (state, action) => {
      state.messageBoxHeight = action.payload;
    },
  },
});

export const { setEditMessage, setMessageBoxHeight } = messageSlice.actions;
export default messageSlice.reducer;
