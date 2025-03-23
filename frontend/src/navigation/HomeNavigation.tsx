import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, PublicProfile } from "@utils/Exports";
import { DashboardTypes } from "src/@types/AuthPropTypes";

const Stack = createNativeStackNavigator<DashboardTypes>();

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="publicProfile" component={PublicProfile} />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
