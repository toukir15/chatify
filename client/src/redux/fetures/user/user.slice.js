import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    conversationUser: null,
  },
  reducers: {
    setConversationUser: (state, action) => {
      state.conversationUser = action.payload;
    },
  },
});

export const { setConversationUser } = userSlice.actions;
export default userSlice.reducer;
