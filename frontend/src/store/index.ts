import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";

const store = configureStore({
  reducer: {
    authSlice,
  },
});

export type ROOT_STATE = ReturnType<typeof store.getState>;

export default store;
