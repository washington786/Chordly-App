import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Playlist } from "src/@types/Audios";
import { cod_gray } from "@styles/Colors";
import ToastContainer from "./ToastContainer";
import Toast from "react-native-toast-message";
import ModalComponent from "./ModalComponent";
import { Button } from "react-native-paper";
import PlaylistForm from "./PlaylistForm";

import Icons from "react-native-vector-icons/Feather";

interface PlaylistModalProps {
  isPlaylistModalShow: boolean;
  handleModalPlaylistShow: () => void;
  playlist: Playlist[];
  isAdding: boolean;
  value: "public" | "private";
  setVisibility: (value: "public" | "private") => void;
  title: string;
  setTitle: (value: string) => void;
  setAdding: (val: boolean) => void;
  handleSubmit: () => void;
  onPlayListPress: (playlist: Playlist) => void;
}

const PlaylistModal = ({
  isPlaylistModalShow,
  handleModalPlaylistShow,
  playlist = [],
  isAdding,
  setTitle,
  setVisibility,
  title,
  value,
  setAdding,
  handleSubmit,
  onPlayListPress,
}: PlaylistModalProps) => {
  return (
    <ModalComponent
      visible={isPlaylistModalShow}
      onClose={handleModalPlaylistShow}
      closeModal={handleModalPlaylistShow}
    >
      <View style={{ paddingHorizontal: 8 }}>
        <Button
          icon={"playlist-plus"}
          uppercase
          mode="contained-tonal"
          onPress={() => setAdding((prev) => !prev)}
        >
          {isAdding ? "close form" : "add play-list"}
        </Button>
        {isAdding && (
          <PlaylistForm
            onChange={(val) => setVisibility(val)}
            value={value}
            onSubmit={handleSubmit}
            onValChange={(val) => setTitle(val)}
            title={title}
          />
        )}
        {!isAdding && playlist.length === 0 ? (
          <Text>No playlists available</Text>
        ) : (
          <ScrollView>
            {playlist.map((audio) => (
              <TouchableOpacity
                onPress={() => onPlayListPress(audio)}
                key={audio.id}
                style={{
                  backgroundColor: cod_gray[50],
                  marginVertical: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  rowGap: 8,
                  gap: 8,
                }}
              >
                <Icons
                  name={audio.visibility === "private" ? "lock" : "globe"}
                  size={20}
                  color={cod_gray[300]}
                />
                <Text>{audio.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <ToastContainer>
          <Toast />
        </ToastContainer>
      </View>
    </ModalComponent>
  );
};

export default PlaylistModal;

const styles = StyleSheet.create({});
