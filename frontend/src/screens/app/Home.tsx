import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  fetchLatest,
  fetchPlaylistByProfile,
  fetchRecommended,
} from "@hooks/query";
import {
  ActivityIndicator,
  Button,
  Text,
  ToggleButton,
} from "react-native-paper";
import { showToast } from "@utils/Toast";
import { cod_gray } from "@styles/Colors";
import LatestUploads from "@components/app/home/LatestUploads";
import Recommended from "@components/app/home/Recommended";
import PaperProviders from "@components/app/PaperProvider";
import ModalComponent from "@components/app/ModalComponent";
import client from "src/api/client";
import { isAxiosError } from "axios";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import { AudioData, Playlist } from "src/@types/Audios";

import Icons from "react-native-vector-icons/Feather";
import Input from "@components/auth/Input";

const Home = () => {
  const queryClient = useQueryClient();
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);

  const [isAdding, setAdding] = useState(false);
  const [value, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState<string>("");
  const [audio, setAudio] = useState<AudioData>();

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchLatest(queryClient, showToast),
  });
  const {
    data: recs,
    error: recError,
    isLoading: loadingRecs,
    isError: isRecError,
  } = useQuery({
    queryKey: ["recommends"],
    queryFn: () => fetchRecommended(queryClient, showToast),
  });

  const {
    data: playlist,
    error: pError,
    isLoading: pIsLoading,
    isError: isPError,
    refetch,
  } = useQuery({
    queryKey: ["playlist"],
    queryFn: async () => {
      const result = await fetchPlaylistByProfile(queryClient, showToast);
      console.log("React Query Playlist Data:", result); // ✅ Debugging
      return result;
    },
    enabled: isPlaylistModalShow, // ✅ Fetch only when modal is open
    refetchInterval: isPlaylistModalShow ? 30000 : false, // ✅ Refresh every 30s
    refetchOnWindowFocus: true, // ✅ Auto-refetch when app is back in focus
    staleTime: 0, // ✅ Forces fresh data on every fetch
  });

  console.log(playlist);

  useEffect(() => {
    if (isError) {
      showToast({ type: "error", message: error.message, title: "Error" });
    }
  }, [isError, error, showToast]);

  useEffect(() => {
    if (isRecError) {
      showToast({ type: "error", message: recError.message, title: "Error" });
    }
  }, [isRecError, recError, showToast]);

  useEffect(() => {
    if (isPError) {
      showToast({ type: "error", message: pError?.message, title: "Error" });
    }
  }, [isPError, pError, showToast]);

  if (isLoading || loadingRecs) {
    return (
      <View style={styles.loadWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  function handleModalShow() {
    setModalShow(!isModalShow);
  }

  function handleModalPlaylistShow() {
    setPlaylistModalShow(!isPlaylistModalShow);
  }

  function onPressAudio() {
    handleModalShow();
  }
  function onLongPressAudio() {
    handleModalShow();
  }

  async function handleAddFavorites(item: any) {
    const token = await fetchFromStorage(Keys.AUTH_TOKEN);
    try {
      const { id } = item;

      const { data } = await client.post(
        `/favorites/?audioId=${id}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast({
        message: "Added to favorites",
        title: "Success",
        type: "success",
      });
      console.log("added: ", data);
      // if (status === 201) {
      // }
    } catch (error) {
      let errorMessage = "An error occurred";

      if (isAxiosError(error)) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);

      showToast({ message: errorMessage, title: "Error", type: "error" });
    }
  }

  function handleAddPlaylist(item: any) {
    handleModalPlaylistShow();
    setAudio(item);
  }

  async function handleSubmit() {
    try {
      if (!title.trim()) {
        showToast({
          message: "title is required",
          title: "Error",
          type: "error",
        });
        return;
      }
      const token = await fetchFromStorage(Keys.AUTH_TOKEN);
      const { data } = await client.post(
        "/playlist/create",
        {
          title: title,
          visibility: value,
          resourceId: audio?.id,
        },
        { headers: { Authorization: "Bearer " + token } }
      );
      console.log(data);
      showToast({
        message: "Created Playlist",
        title: "Success",
        type: "success",
      });
      // mutate();
    } catch (error) {
      let errorMessage = "An error occurred";

      if (isAxiosError(error)) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);

      showToast({ message: errorMessage, title: "Error", type: "error" });
    }
    onResetForm();
  }

  function onResetForm() {
    setAdding(false);
    setTitle("");
    setVisibility("public");
  }

  async function onPlaylistPress(playlist: Playlist) {
    try {
      const { data } = await client.patch(
        "/playlist",
        {
          id: playlist.id,
          item: audio?.id,
          title: audio?.title,
          visibility: playlist.visibility,
        },
        {
          headers: {
            Authorization:
              "Bearer " + (await fetchFromStorage(Keys.AUTH_TOKEN)),
          },
        }
      );
      showToast({
        message: "audio added to " + playlist.title,
        title: "success",
        type: "success",
      });
      console.log(data);
      setTimeout(() => {
        setPlaylistModalShow(false);
        setAudio(undefined);
      }, 3000);
    } catch (error) {
      let errorMessage = "Sorry, something just happened";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast({ message: errorMessage, title: "Error", type: "error" });
    }
  }

  return (
    <PaperProviders
      mainContentChildren={
        <View>
          <Toast />
          <LatestUploads
            data={data}
            onAudioLongPress={(item) => onLongPressAudio()}
            onAudioPress={(item) => onPressAudio()}
          />
          <Recommended
            recs={recs}
            handleFavAdd={handleAddFavorites}
            handlePlaylistAdd={handleAddPlaylist}
          />

          {/* playlist modal */}
          <PlaylistModal
            isPlaylistModalShow={isPlaylistModalShow}
            handleModalPlaylistShow={handleModalPlaylistShow}
            playlist={playlist}
            isAdding={isAdding}
            title={title}
            value={value}
            setAdding={() => setAdding(!isAdding)}
            setTitle={(val) => setTitle(val)}
            setVisibility={(val) => setVisibility(val)}
            handleSubmit={handleSubmit}
            onPlayListPress={onPlaylistPress}
          />
        </View>
      }
    >
      <ModalComponent
        visible={isModalShow}
        onClose={handleModalShow}
        closeModal={handleModalShow}
      >
        <View>
          <Text>test</Text>
        </View>
      </ModalComponent>
    </PaperProviders>
  );
};

interface playlistProps {
  isPlaylistModalShow: boolean;
  handleModalPlaylistShow(): void;
  playlist: Playlist[]; // Ensure playlist is typed as an array
  isAdding: boolean;
  value: "public" | "private";
  setVisibility(value: "public" | "private"): void;
  title: string;
  setTitle(value: string): void;
  setAdding: (val: any) => void;
  handleSubmit(): void;
  onPlayListPress(playlist: Playlist): void;
}

function PlaylistModal({
  isPlaylistModalShow,
  handleModalPlaylistShow,
  playlist = [], // Set a default value as an empty array
  isAdding,
  setTitle,
  setVisibility,
  title,
  value,
  setAdding,
  handleSubmit,
  onPlayListPress,
}: playlistProps) {
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
          onPress={() => setAdding((prev:any) => !prev)}
        >
          {isAdding ? "close form" : "add play-list"}
        </Button>
        {isAdding && (
          <PlaylistForm
            onChange={(val: "public" | "private") => setVisibility(val)}
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
            {playlist.map((audio: Playlist) => {
              return (
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
              );
            })}
          </ScrollView>
        )}
        <Toast />
      </View>
    </ModalComponent>
  );
}
interface formProps {
  value: "public" | "private";
  onChange(value: string): void;
  onSubmit(): void;
  onValChange(value: string): void;
  title: string;
}
function PlaylistForm({
  onChange,
  value,
  onSubmit,
  title,
  onValChange,
}: formProps) {
  return (
    <View>
      <Input
        placeholder="title"
        style={{ borderColor: "gray", borderWidth: 1, marginVertical: 5 }}
        placeholderTextColor={"gray"}
        contentStyle={{ color: "gray" }}
        onChangeText={onValChange}
        value={title}
      />
      <View style={{ paddingVertical: 5 }}>
        <Text>Select Visibility Type</Text>
        <ToggleButton.Row value={value} onValueChange={onChange}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 4,
              paddingVertical: 5,
            }}
          >
            <ToggleButton icon={"earth"} value="public" />
            <Text>Public</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 4,
              paddingVertical: 5,
            }}
          >
            <ToggleButton icon={"lock"} value="private" />
            <Text>Private</Text>
          </View>
        </ToggleButton.Row>
      </View>
      <Button uppercase mode="contained" onPress={onSubmit}>
        Create
      </Button>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  loadWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
