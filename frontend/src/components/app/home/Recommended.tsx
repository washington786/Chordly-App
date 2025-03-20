import { Image, Pressable, ScrollView, View } from "react-native";
import React, { FC } from "react";
import { IconButton, Text } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";
import { AudioData } from "src/@types/Audios";
import { useToggleFavorite } from "@hooks/useFavorites";

interface prop {
  recs: any;
  handlePlaylistAdd(item: AudioData): void;
  handleFavAdd?(item: AudioData): void;
}
const Recommended: FC<prop> = ({ recs, handlePlaylistAdd }) => {
  const { mutate: toggleFavorite } = useToggleFavorite();
  return (
    <View style={{ paddingHorizontal:6 }}>
      <Text
        variant="titleMedium"
        style={[GlobalStyles.mainTitle, GlobalStyles.title]}
      >
        You may like this
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row", // Arrange columns in a row
          paddingVertical: 10,
        }}
      >
        {/* Group items into columns */}
        {Array.from({ length: Math.ceil(recs.audios.length / 2) }).map(
          (_, colIndex) => (
            <View
              key={colIndex}
              style={{ flexDirection: "column", marginRight: 10 }}
            >
              {recs.audios
                .slice(colIndex * 2, colIndex * 2 + 2) // Get 2 items per column
                .map((item: AudioData, rowIndex:number) => (
                  <Pressable
                    key={item.id || `${colIndex}-${rowIndex}`}
                    style={{
                      width: 180, // Adjust column width
                      height: 200, // Adjust row height
                      marginBottom: 10, // Space between rows
                      position: "relative",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Top Action Icons */}
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        width: "100%",
                        flexDirection: "row",
                        zIndex: 1,
                      }}
                    >
                      <IconButton
                        size={20}
                        icon="playlist-music"
                        iconColor="white"
                        onPress={() => handlePlaylistAdd(item)}
                        rippleColor="yellow"
                      />
                      <IconButton
                        size={20}
                        icon="cards-heart"
                        iconColor="white"
                        onPress={() => toggleFavorite(item.id as string)}
                        rippleColor="yellow"
                      />
                    </View>

                    {/* Image */}
                    <Image
                      source={{
                        uri: item.poster || "https://via.placeholder.com/150",
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />

                    {/* Bottom Title */}
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        paddingVertical: 5,
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
                        {item.title || "Unknown Title"}
                      </Text>
                    </View>
                  </Pressable>
                ))}
            </View>
          )
        )}
      </ScrollView>

      {/* <ScrollView
        horizontal={true}
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
      </ScrollView> */}
    </View>
  );
};

export default Recommended;

// const GlobalStyles = StyleSheet.create({})
