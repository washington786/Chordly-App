import { ScrollView, View } from "react-native";
import React, { FC } from "react";
import { Text } from "react-native-paper";
import Latests from "../Latests";
import { AudioData } from "src/@types/Audios";
import GlobalStyles from "@styles/GlobalStyles";

interface prop {
  data: any;
  onAudioPress(item: AudioData): void;
  onAudioLongPress(item: AudioData): void;
}
const LatestUploads: FC<prop> = ({ data, onAudioLongPress, onAudioPress }) => {
  return (
    <View>
      <Text variant="labelLarge" style={GlobalStyles.mainTitle}>
        Latest Uploads
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={GlobalStyles.scroller}
        contentContainerStyle={{ flexDirection: "row" }}
      >
        {data.audios?.map((item: AudioData) => {
          return (
            <Latests
              key={item.id}
              poster={item?.poster as string}
              title={item.title}
              onLongPress={() => onAudioLongPress(item)}
              onPress={() => onAudioPress(item)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default LatestUploads;
