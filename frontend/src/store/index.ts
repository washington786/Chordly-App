import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth";
import notificationReducer from "./Notification";

const reducer = combineReducers({
  auth:authSlice,
  notification:notificationReducer,
});
const store = configureStore({
  reducer: reducer,
});

export type ROOT_STATE = ReturnType<typeof store.getState>;

export default store;
