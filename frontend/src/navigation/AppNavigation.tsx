import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import BottomNavigation from "./BottomNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  authState,
  updateBusy,
  updateLoggedIn,
  updateProfile,
} from "src/store/auth";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import client from "src/api/client";
import MainNavigation from "./MainNavigation";
import { ActivityIndicator } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const AppStack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { authSlice } = useSelector(authState);
  useEffect(() => {
    async function fetchToken() {
      dispatch(updateBusy(true));
      try {
        const token = await fetchFromStorage(Keys.AUTH_TOKEN);

        if (!token) return dispatch(updateBusy(false));

        const { data } = await client.get("/auth/is-auth", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        dispatch(updateLoggedIn(true));
        dispatch(updateProfile(data.profile));
        dispatch(updateBusy(false));
        console.log(data);
      } catch (error) {
        console.log("error: ", error);
        dispatch(updateBusy(false));
      }
    }
    fetchToken();
  }, []);

  return (
    <MainNavigation>
      {authSlice.busy ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      ) : null}
      {authSlice.loggedIn ? <BottomNavigation /> : <AuthNavigator />}

      {/* <AppStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={
          authSlice.loggedIn && !authSlice.busy ? "app" : "auth"
        }
      >
        <AppStack.Screen name="auth" component={AuthNavigator} />
        <AppStack.Screen name="app" component={BottomNavigation} />
      </AppStack.Navigator> */}
    </MainNavigation>
  );
};

export default AppNavigation;
