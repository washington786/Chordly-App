import React, { FC, ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { GreenMain, white } from "@styles/Colors";
import { ImageBackground, Platform, StatusBar } from "react-native";

import { StatusBar as ExpoStatusBar } from "expo-status-bar";

interface Prop {
  children: ReactNode;
}
const Gradient: FC<Prop> = ({ children }) => {
  return (
    <>
      <LinearGradient
        colors={[GreenMain[200], GreenMain[500], GreenMain[900]]}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require("../../assets/headsets.png")}
          resizeMode="contain"
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.01)",
            paddingVertical: 0,
          }}
        >
          {children}
        </ImageBackground>
      </LinearGradient>
      <StatusBar
        backgroundColor={Platform.OS === "android" ? GreenMain[200] : white[50]}
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      {Platform.OS === "android" && (
        <ExpoStatusBar backgroundColor={GreenMain[200]} style="light" />
      )}
    </>
  );
};

export default Gradient;
