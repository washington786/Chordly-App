import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useState } from "react";
import { GreenMain } from "@styles/Colors";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const AudioPlayingComponent = () => {
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
          <Text style={{}}>Now Playing</Text>
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
    height: 170,
    backgroundColor: GreenMain[50],
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
