import React, { FC, ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";

interface prop {
  children: ReactNode;
}

const MainNavigation: FC<prop> = (props) => {
  return <NavigationContainer>{props.children}</NavigationContainer>;
};

export default MainNavigation;
