import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Profile, Upload } from "@utils/Exports";
import { GreenMain, white } from "@styles/Colors";

import AntIcons from "react-native-vector-icons/AntDesign";
import ProfileNavigation from "./ProfileNavigation";

const BottomStack = createBottomTabNavigator();
const BottomNavigation = () => {
  return (
    <BottomStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: white[100],
          borderTopColor: GreenMain[500],
          borderTopWidth: 0.5,
        },
      }}
    >
      <BottomStack.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: (props) => {
            return (
              <AntIcons name="home" size={props.size} color={props.color} />
            );
          },
          tabBarActiveTintColor: GreenMain[600],
          tabBarLabel: "Dashboard",
        }}
      />
      <BottomStack.Screen
        name="upload"
        component={Upload}
        options={{
          tabBarIcon: (props) => {
            return (
              <AntIcons
                name="clouduploado"
                size={props.size}
                color={props.color}
              />
            );
          },
          tabBarActiveTintColor: GreenMain[600],
          tabBarLabel: "Uploads",
        }}
      />
      <BottomStack.Screen
        name="profileNavigation"
        component={ProfileNavigation}
        options={{
          tabBarIcon: (props) => {
            return (
              <AntIcons name="user" size={props.size} color={props.color} />
            );
          },
          tabBarActiveTintColor: GreenMain[600],
          tabBarLabel: "Profile",
        }}
      />
    </BottomStack.Navigator>
  );
};

export default BottomNavigation;
