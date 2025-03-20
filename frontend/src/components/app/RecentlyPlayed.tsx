import { Image, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { cod_gray } from "@styles/Colors";
import { Divider, Text } from "react-native-paper";
import { AudioPlay } from "src/@types/Audios";
import { useFetchRecentlyPlayed } from "@hooks/historyQuery";
import Loader from "@components/Loader";
import { showToast } from "@utils/Toast";

interface item {
  category: string;
  title: string;
  poster: string;
  id?: string;
}

const RecentlyPlayed = () => {
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
    <View style={styles.container}>
      <View>
        <Text variant="titleMedium" style={styles.title}>
          Recently Played
        </Text>
        <Divider />
        <ScrollView
          horizontal
          contentContainerStyle={{
            backgroundColor: "white",
            flex: 1,
            gap: 4,
            paddingHorizontal: 5,
          }}
        >
          {data.map((audio: item) => {
            return (
              <Item
                key={audio.id}
                poster={audio.poster}
                title={audio.title}
                category={audio.category}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

function Item({ category, title, poster }: item) {
  return (
    <View style={styles.con}>
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
    </View>
  );
}

export default RecentlyPlayed;

const styles = StyleSheet.create({
  con: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    backgroundColor: cod_gray[50],
    marginVertical: 8,
    width: "30%",
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
