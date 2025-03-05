import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  ForgotPassword,
  OneTimePinVerification,
  SignIn,
  SignUp,
} from "@utils/Exports";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="sign-in"
    >
      <Stack.Screen name="sign-up" component={SignUp} />
      <Stack.Screen name="sign-in" component={SignIn} />
      <Stack.Screen name="reset-password" component={ForgotPassword} />
      <Stack.Screen name="otp-verify" component={OneTimePinVerification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
