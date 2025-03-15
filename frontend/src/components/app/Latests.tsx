import { Image, Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { Text, Title } from "react-native-paper";
import { white } from "@styles/Colors";

interface prop {
  poster: string;
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
}
const Latests = ({ poster, title, onLongPress, onPress }: prop) => {
  return (
    <Pressable
      style={styles.wrapper}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Image
        source={{ uri: poster }}
        style={{ height: 100, aspectRatio: 1, borderRadius: 10 }}
      />
      <Text
        ellipsizeMode="tail"
        variant="titleSmall"
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Latests;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 5,
    marginHorizontal: 4,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: white[50],
    borderRadius: 10,
  },
  title: {
    paddingVertical: 3,
  },
});
