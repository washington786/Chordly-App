import { StyleSheet, View } from "react-native";
import React, { ReactNode } from "react";

interface prop {
  children: ReactNode;  
}
const InputWrapper = (props: prop) => {
  return <View style={styles.container}>{props.children}</View>;
};

export default InputWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 0, 0,0.01)",
    borderRadius: 3,
    paddingVertical: 8,
    marginVertical: 5,
  },
});
