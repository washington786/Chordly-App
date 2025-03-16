import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Icons from "react-native-vector-icons/Ionicons";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
const AppHeader = () => {
  const { goBack } = useNavigation();
  return (
    <TouchableOpacity onPress={() => goBack()} style={styles.container}>
      <Icons
        name={Platform.OS === "android" ? "arrow-back" : "chevron-back"}
        color={"blue"}
        size={20}
      />
      <Text variant="bodySmall" style={{ color: "blue" }}>
        go back
      </Text>
    </TouchableOpacity>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal:2
  },
});
