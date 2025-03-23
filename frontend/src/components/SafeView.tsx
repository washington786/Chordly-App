import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React, { ReactNode } from "react";

const SafeView = ({ children }: { children: ReactNode }) => {
  return <SafeAreaView style={styles.page}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
});
export default SafeView;