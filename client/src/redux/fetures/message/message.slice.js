import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    editMessage: null,
  },
  reducers: {
    setEditMessage: (state, action) => {
      state.editMessage = action.payload;
    },
  },
});

export const { setEditMessage } = messageSlice.actions;
export default messageSlice.reducer;
