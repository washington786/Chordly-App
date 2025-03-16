import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Profile } from "@utils/Exports";
import ProfileSettings from "@screens/app/ProfileSettings";

const Stack = createNativeStackNavigator();

export default function ProfileNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="profile"
    >
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="settings" component={ProfileSettings} />
    </Stack.Navigator>
  );
}
