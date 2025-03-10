import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const UploadAudio = ({
  audioFile,
  setAudioFile,
}: {
  audioFile: any;
  setAudioFile: any;
}) => {
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*", // Only allow audio files
      });

      console.log("Document Picker Result:", result); // Debugging output

      if (!result.canceled && result.assets?.length > 0) {
        setAudioFile(result.assets[0]); // Store only the first file object
      } else {
        console.log("File selection was canceled");
      }
    } catch (error) {
      console.error("Error selecting audio file:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadBox} onPress={pickAudio}>
        {audioFile ? (
          <View style={styles.audioInfo}>
            <MaterialIcons name="audiotrack" size={40} color="#007bff" />
            <Text variant="bodyMedium" numberOfLines={1}>
              {audioFile.name}
            </Text>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="upload-file" size={40} color="#6c757d" />
            <Text variant="bodyMedium">Tap to Upload Audio</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default UploadAudio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 2,
  },
  uploadBox: {
    height: 200,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  placeholder: {
    alignItems: "center",
  },
  audioInfo: {
    alignItems: "center",
  },
});
