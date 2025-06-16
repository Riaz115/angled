import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const selectUser = (state) => state.user.user;

export const { addUser } = userSlice.actions;
export default userSlice.reducer;
