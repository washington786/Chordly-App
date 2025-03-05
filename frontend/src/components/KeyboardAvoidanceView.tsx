import { KeyboardAvoidingView } from "react-native";
import React, { FC, ReactNode } from "react";
import GlobalStyles from "@styles/GlobalStyles";

interface prop {
  children: ReactNode;
}

const KeyboardAvoidanceView: FC<prop> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={[
        GlobalStyles.container,
        GlobalStyles.containerSpaceHorizontal,
        GlobalStyles.containerSpaceVertical,
      ]}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidanceView;
