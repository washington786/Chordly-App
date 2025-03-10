import { ScrollView, StyleSheet } from "react-native";
import React, { FC, ReactNode } from "react";
import { white } from "@styles/Colors";

interface prop {
  children: ReactNode;
}
const ScrollViewWrapper: FC<prop> = (props) => {
  return (
    <ScrollView
      style={styles.wrap}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      {props.children}
    </ScrollView>
  );
};

export default ScrollViewWrapper;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: white[100],
  },
});
