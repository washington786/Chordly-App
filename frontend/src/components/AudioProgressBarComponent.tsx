import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import Slider from "@react-native-community/slider";
import useAudio from "@hooks/audioHook";
import { Button } from "react-native-paper";

// interface prop {
//   position: number;
//   duration: number;
//   setPosition(): void;
//   handleSeek(): void;
//   isPlaying: boolean;
//   playPauseAudio: () => void;
//   url: string;
// }
// const AudioProgressBarComponent: FC<prop> = ({
//   duration,
//   position,
//   setPosition,
//   handleSeek,
//   isPlaying,
//   playPauseAudio,
//   url,
// }) => {
//   const { formatTime } = useAudio(url);
//   return (
//     <View style={styles.container}>
//       <Text style={styles.time}>{formatTime(position)}</Text>
//       <Slider
//         style={styles.slider}
//         minimumValue={0}
//         maximumValue={duration}
//         value={position}
//         onValueChange={setPosition}
//         onSlidingComplete={handleSeek}
//         minimumTrackTintColor="#3A5B3E"
//         maximumTrackTintColor="#AACBAE"
//         thumbTintColor="#2A3D2C"
//       />
//       <Text style={styles.time}>{formatTime(duration)}</Text>
//       <Text onPress={playPauseAudio} style={styles.playButton}>
//         {isPlaying ? "Pause" : "Play"}
//       </Text>
//     </View>
//   );
// };

interface AudioProgressBarComponentProps {
  duration: number;
  handleSeek: (value: number) => void; // Make sure this function signature expects a value argument
  position: number;
  setPosition: (value: number) => void;
  isPlaying: boolean;
  playPauseAudio: () => void;
  url?: string;
}

const AudioProgressBarComponent: FC<AudioProgressBarComponentProps> = ({
  duration,
  handleSeek,
  position,
  setPosition,
  isPlaying,
  playPauseAudio,
}) => {
  const { formatTime } = useAudio();
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(position)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onValueChange={setPosition}
        onSlidingComplete={handleSeek}
      />
      <Text style={styles.time}>{formatTime(duration)}</Text>
      <Button onPress={playPauseAudio}>{isPlaying ? "Pause" : "Play"}</Button>
    </View>
  );
};

export default AudioProgressBarComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  time: {
    color: "white",
    fontSize: 14,
  },
  playButton: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
