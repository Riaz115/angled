import { createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

const initialState = {
  token: null,
  userType: null,
  isLoggedIn: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      console.log(payload.token);
      state.token = payload.token;
      state.userType = payload.userType;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      state.user = null;
    },

    setUser: (state, { payload }) => {
      state.user = payload; // Set the user data from the action payload
    },
  },
});

export const fetchUser = () => async (dispatch) => {
  try {
    const { data } = await apiClient.get("/users/my-info");
    // console.log(data);

    if (data) {
      dispatch(authSlice.actions.setUser(data?.result)); // Dispatch the action to set the user data
    }
  } catch (e) {
    console.e("Error fetching user data:", e);
  }
};

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
