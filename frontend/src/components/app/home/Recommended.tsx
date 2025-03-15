import { Image, Pressable, ScrollView, View } from "react-native";
import React, { FC } from "react";
import { IconButton, Text } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { AudioData } from "src/@types/Audios";

interface prop {
  recs: any;
  handlePlaylistAdd(item: AudioData): void;
  handleFavAdd(item: AudioData): void;
}
const Recommended: FC<prop> = ({ recs, handleFavAdd, handlePlaylistAdd }) => {
  return (
    <View>
      <Text variant="labelLarge" style={GlobalStyles.mainTitle}>
        Recommended
      </Text>
      <ScrollView
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={GlobalStyles.scroller}
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        {recs.audios?.map((item: AudioData) => {
          return (
            <Pressable
              style={{
                width: "33.3333%",
                paddingVertical: 5,
                paddingHorizontal: 8,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={item.id}
            >
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  paddingVertical: 5,
                  paddingHorizontal: 4,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  zIndex: 1,
                  flexDirection: "row",
                }}
              >
                <IconButton
                  size={20}
                  icon={"playlist-music"}
                  iconColor="white"
                  onPress={() => handlePlaylistAdd(item)}
                  rippleColor={"yellow"}
                />
                <IconButton
                  size={20}
                  icon={"cards-heart"}
                  iconColor="white"
                  onPress={() => handleFavAdd(item)}
                  rippleColor={"yellow"}
                />
              </View>
              <Image
                source={{ uri: item.poster }}
                style={{ width: "100%", height: 200 }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  alignItems: "center",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Recommended;

// const GlobalStyles = StyleSheet.create({})
