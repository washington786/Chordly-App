import { View } from "react-native";
import React, { FC, ReactNode } from "react";
import GlobalStyles from "@styles/GlobalStyles";

interface prop{
    children:ReactNode
}
const ToastContainer:FC<prop> = ({children}) => {
  return (
    <View
      style={GlobalStyles.toasterContainer}
    >
      {children}
    </View>
  );
};

export default ToastContainer;
