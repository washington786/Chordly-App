import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  ForgotPassword,
  OneTimePinVerification,
  SignIn,
  SignUp,
} from "@utils/Exports";
import { AuthPropTypes } from "src/@types/AuthPropTypes";
// import { useSelector } from "react-redux";
// import { authState } from "src/store/auth";

const Stack = createNativeStackNavigator<AuthPropTypes>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="signIn"
    >
      <Stack.Screen name="signUp" component={SignUp} />
      <Stack.Screen name="signIn" component={SignIn} />
      <Stack.Screen name="resetPassword" component={ForgotPassword} />
      <Stack.Screen name="verification" component={OneTimePinVerification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
