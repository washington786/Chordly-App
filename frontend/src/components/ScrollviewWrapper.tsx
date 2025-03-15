import { ScrollView, ScrollViewProps, StyleSheet } from "react-native";
import React, { FC, ReactNode } from "react";
import { white } from "@styles/Colors";

interface prop {
  children: ReactNode;
}
const ScrollViewWrapper = (props: prop, scroll_prop: ScrollViewProps) => {
  return (
    <ScrollView
      style={styles.wrap}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...scroll_prop}
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
