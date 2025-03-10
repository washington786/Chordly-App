import { View } from "react-native";
import React, { FC } from "react";
import { ProgressBar, ProgressBarProps } from "react-native-paper";
import { GreenMain } from "@styles/Colors";

const ProgressBarComponent: FC<ProgressBarProps> = (props) => {
  return (
    <View style={{ marginVertical: 8 }}>
      <ProgressBar color={GreenMain[300]} {...props} />
    </View>
  );
};

export default ProgressBarComponent;
