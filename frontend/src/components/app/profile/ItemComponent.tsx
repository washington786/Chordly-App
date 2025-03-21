import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { cod_gray, white } from "@styles/Colors";

interface audioProps {
  id: string;
  poster: string;
  category: string;
  title: string;
}

const ItemComponent: FC<audioProps> = ({ category, id, poster, title }) => {
  let cover = require("../../../assets/cover.png");
  return (
    <TouchableOpacity style={styles.container} key={id}>
      <Image source={{ uri: poster || cover }} style={styles.image} />
      <View style={{ paddingHorizontal:6 }}>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.txt}>
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemComponent;

const styles = StyleSheet.create({
  image: {
    height: 70,
    width: 70,
    objectFit: "contain",
    borderRadius: 10,
  },
  container: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 4,
    backgroundColor: white[50],
    marginVertical: 5,
    borderWidth:0.2,
    borderColor:cod_gray[300]
  },
  txt:{
    fontWeight:"200"
  }
});
