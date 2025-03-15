import { StyleSheet, Text, View } from "react-native";
import React, { FC, ReactNode } from "react";
import { PaperProvider, Portal } from "react-native-paper";

interface ModalProps {
  children: ReactNode;
  mainContentChildren?: ReactNode;
}
const PaperProviders: FC<ModalProps> = (props) => {
  return (
    <PaperProvider settings={{ rippleEffectEnabled: true }}>
      <Portal>{props.children}</Portal>
      {props.mainContentChildren}
    </PaperProvider>
  );
};

export default PaperProviders;
