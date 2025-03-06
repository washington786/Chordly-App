import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, Upload } from "@utils/Exports";

const BottomStack = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <BottomStack.Navigator>
      <BottomStack.Screen name="home" component={Home} />
      <BottomStack.Screen name="upload" component={Upload} />
      <BottomStack.Screen name="profile" component={Profile} />
    </BottomStack.Navigator>
  );
};

export default BottomNavigation;
