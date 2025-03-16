import { StyleSheet, View } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native-paper";
import { white } from "@styles/Colors";

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: white[50],
    flex: 1,
  },
});
