import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { white } from "@styles/Colors";
import { Text } from "react-native-paper";

const EmptyRecords = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://static.vecteezy.com/system/resources/thumbnails/012/299/247/small/document-has-been-approved-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg",
        }}
        style={styles.img}
      />
      <Text variant="titleLarge">Sorry, Your records are empty!</Text>
    </View>
  );
};

export default EmptyRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white[50],
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    objectFit: "cover",
    height: 400,
    width: "100%",
  },
});
