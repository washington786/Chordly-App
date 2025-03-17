import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Playlist } from "src/@types/Audios";
import { Text } from "react-native-paper";
import { GreenMain } from "@styles/Colors";
import Icons from "react-native-vector-icons/Feather";

interface props {
  playlist: Playlist;
  onPress?: () => void;
}
const ItemComponent: FC<props> = ({ playlist, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon name="queue-music" size={20} />
      <View style={styles.wrap}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {playlist.title}
          </Text>
          <Text>
            {playlist.itemsCount}
            {playlist.itemsCount > 1 ? " audio" : " audio"}
          </Text>
        </View>
        <Icons
          name={playlist.visibility === "public" ? "globe" : "lock"}
          size={18}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GreenMain[100],
    marginVertical: 5,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 6,
    paddingVertical: 5,
    marginHorizontal: 3,
    borderRadius: 5,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
});
