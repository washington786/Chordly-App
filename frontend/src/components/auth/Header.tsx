import { Image, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { Paragraph, Text } from "react-native-paper";
import GlobalStyles from "@styles/GlobalStyles";

interface prop {
  title?: string;
  description?: string;
}
const Header: FC<prop> = (props) => {
  return (
    <View>
      <View>
        <Image
          source={require("../../../assets/logo.png")}
          style={GlobalStyles.logo}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </View>
      <Text variant="displaySmall" style={[GlobalStyles.textColor]}>
        {props.title}
      </Text>
      <Paragraph style={[GlobalStyles.textColor]}>
        {props.description}
      </Paragraph>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
