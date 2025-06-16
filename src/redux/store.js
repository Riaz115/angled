import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };
