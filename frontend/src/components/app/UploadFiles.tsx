import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Text } from "react-native-paper";
import { GreenMain } from "@styles/Colors";
import MaterialIcons from "react-native-vector-icons/Ionicons";

interface UploadFilesProps {
  image: any;
  setImage: (uri: any) => void;
}

const UploadFiles = (props: UploadFilesProps) => {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      props.setImage(result?.assets[0]);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text variant="bodyMedium">Upload Your Image</Text> */}

      <TouchableOpacity style={styles.uploadBox} onPress={pickImageAsync}>
        {props.image ? (
          <Image source={{ uri: props.image.uri }} style={styles.image} />
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <MaterialIcons name="images-outline" size={40} color="#6c757d" />
            <Text variant="bodyLarge">Tap to Upload Poster</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadFiles;

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    flex: 1,
    marginHorizontal: 2,
  },
  uploadBox: {
    // width: 200,
    height: 200,
    backgroundColor: GreenMain[100],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    width: 200,
    backgroundColor: GreenMain[400],
    borderRadius: 10,
    paddingVertical: 5,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
