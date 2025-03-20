import { StyleSheet, View, Animated, Image } from "react-native";
import React, { FC, useState } from "react";
import { GreenMain } from "@styles/Colors";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import AudioProgressBarComponent, {
  AudioProgressBarComponentProps,
} from "@components/AudioProgressBarComponent";

interface playingAudioProps extends AudioProgressBarComponentProps {
  audioTitle: string;
  audioPoster: string;
  audioCategory: string;
}

const AudioPlayingComponent: FC<playingAudioProps> = ({
  duration,
  formatTime,
  handleSeek,
  isPlaying,
  playPauseAudio,
  position,
  setPosition,
  audioCategory,
  audioPoster,
  audioTitle,
}) => {
  const [visible, setVisible] = useState(true);
  const translateY = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationY > 50) {
        // If swiped down enough, animate out
        Animated.timing(translateY, {
          toValue: 200, // Move it off the screen
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      } else {
        // Reset if not swiped enough
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!visible) return null;

  return (
    <GestureHandlerRootView>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
        >
          <View style={styles.wrap}>
            <View style={styles.imgWrapper}>
              <Image
                source={{
                  uri: audioPoster,
                }}
                style={styles.img}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="titleMedium"
              >
                {audioTitle}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                variant="labelSmall"
                style={styles.category}
              >
                {audioCategory}
              </Text>
              <View
                style={{
                  backgroundColor: GreenMain[300],
                  width: "100%",
                  borderRadius: 10,
                  marginVertical: 10,
                }}
              >
                <AudioProgressBarComponent
                  duration={duration}
                  formatTime={formatTime}
                  handleSeek={handleSeek}
                  isPlaying={isPlaying}
                  playPauseAudio={playPauseAudio}
                  position={position}
                  setPosition={setPosition}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default AudioPlayingComponent;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 190,
    backgroundColor: GreenMain[50],
    justifyContent: "flex-start",
    alignItems: "flex-start",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  img: {
    width: 120,
    height: 120,
    objectFit: "contain",
  },
  imgWrapper: {
    borderRadius: 10,
  },
  category: {
    fontWeight: "300",
  },
  fun: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
