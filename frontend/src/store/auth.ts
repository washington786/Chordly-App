import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ROOT_STATE } from ".";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  avatar?: string;
  followers: number;
  followings: number;
}

interface AuthSliceDoc {
  profile: UserProfile | null;
  loggedIn: boolean;
  busy: boolean;
}

const initialState: AuthSliceDoc = {
  profile: null,
  loggedIn: false,
  busy: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateProfile(state, { payload }: PayloadAction<UserProfile | null>) {
      state.profile = payload;
    },
    updateLoggedIn(state, { payload }: PayloadAction<boolean>) {
      state.loggedIn = payload;
    },
    updateBusy(state, { payload }: PayloadAction<boolean>) {
      state.busy = payload;
    },
  },
});

export const { updateLoggedIn, updateProfile, updateBusy } = authSlice.actions;

export const authState = createSelector(
  (state: ROOT_STATE) => state.auth,
  (authState) => authState
);

export default authSlice.reducer;
