import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notifications } from "@utils/Notification";
import { ROOT_STATE } from ".";

const initialState: Notifications = {
  message: "",
  type: "error",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    updateNotification: (state, { payload }: PayloadAction<Notifications>) => {
      state.message = payload.message;
      state.type = payload.type;
    },
  },
});

export const { updateNotification } = notificationSlice.actions;

export const getNotificationState = createSelector(
  (state: ROOT_STATE) => state.notification,
  (notificationState) => notificationState
);

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
