import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { cod_gray } from "@styles/Colors";
import { Divider, Text } from "react-native-paper";
import { useFetchRecentlyPlayed } from "@hooks/historyQuery";
import Loader from "@components/Loader";
import { showToast } from "@utils/Toast";
import { AudioData, AudioPlay } from "src/@types/Audios";

interface item {
  category: string;
  title: string;
  poster: string;
  id?: string;
  onPressAudio?(): void;
}
interface audio {
  onAudioPress(item: AudioPlay): void;
}

const RecentlyPlayed = ({ onAudioPress }: audio) => {
  const { data, isError, error, isLoading } = useFetchRecentlyPlayed();

  useEffect(() => {
    if (error && isError) {
      showToast({ message: error.message, title: "Error", type: "error" });
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    // <View style={styles.container}>
    //   <View>
    //     <Text variant="titleMedium" style={styles.title}>
    //       Recently Played
    //     </Text>
    //     <Divider />
    //     <View style={{ flex: 1,backgroundColor:"yellow" }}>
    //       <ScrollView
    //         horizontal={true}
    //         showsHorizontalScrollIndicator={false}
    //         style={{ backgroundColor: "transparent" }}
    //         contentContainerStyle={{
    //           backgroundColor: "transparent",
    //           gap: 4,
    //           paddingHorizontal: 10,
    //           flexDirection:"row"
    //         }}
    //       >
    //         {data.map((audio: AudioPlay) => {
    //           return (
    //             <Item
    //               key={audio.id + audio.owner.id + Math.random() * 10}
    //               poster={audio.poster as string}
    //               title={audio.title}
    //               category={audio.category}
    //               onPressAudio={() => onAudioPress(audio)}
    //             />
    //           );
    //         })}
    //       </ScrollView>
    //     </View>
    //   </View>
    // </View>
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Recently Played
      </Text>
      <Divider />
      <View style={{ flex: 1, backgroundColor: "transparent" }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ backgroundColor: "transparent" }}
          contentContainerStyle={{
            flexDirection: "row",
            gap: 4,
            paddingHorizontal: 6,
          }}
        >
          {data.map((audio: AudioPlay) => (
            <Item
              key={audio.id + audio.owner.id + Math.random() * 10}
              poster={audio.poster as string}
              title={audio.title}
              category={audio.category}
              onPressAudio={() => onAudioPress(audio)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

function Item({ category, title, poster, onPressAudio }: item) {
  return (
    <TouchableOpacity style={styles.con} onPress={onPressAudio}>
      <Image
        source={{
          uri: poster,
        }}
        style={styles.img}
      />
      <View style={styles.label}>
        <Text variant="bodyMedium" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="bodySmall" numberOfLines={1}>
          {category}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default RecentlyPlayed;

const styles = StyleSheet.create({
  // con: {
  //   paddingVertical: 5,
  //   paddingHorizontal: 7,
  //   backgroundColor: cod_gray[50],
  //   marginVertical: 8,
  //   width: "30%",
  //   borderRadius: 15,
  //   alignItems: "center",
  // },
  con: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    backgroundColor: cod_gray[50],
    marginVertical: 8,
    width: 150,
    borderRadius: 15,
    alignItems: "center",
  },
  img: {
    height: 120,
    width: "100%",
    objectFit: "contain",
    borderRadius: 15,
  },
  container: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  label: {
    alignItems: "center",
  },
  title: {
    fontWeight: "400",
  },
});
