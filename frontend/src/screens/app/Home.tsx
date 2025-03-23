import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  fetchLatest,
  fetchPlaylistByProfile,
  fetchRecommended,
} from "@hooks/query";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";

import {
  LatestUploads,
  Recommended,
  PaperProviders,
  ModalComponent,
  showToast,
  PlaylistModal,
  AudioProgressBarComponent,
  useAudioPlayer,
  AudioPlayingComponent,
  ToastContainer,
} from "@components/index";

import client from "src/api/client";
import { isAxiosError } from "axios";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import { AudioData, AudioPlay, Playlist } from "src/@types/Audios";
import { LinearGradient } from "expo-linear-gradient";
import useHistory from "@hooks/useHistory";
import RecentlyPlayed from "@components/app/RecentlyPlayed";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { DashboardTypes } from "src/@types/AuthPropTypes";
import { useSelector } from "react-redux";
import { authState } from "src/store/auth";
import AudioModal from "@components/app/home/AudioModal";
import { useToggleFavorite } from "@hooks/useFavorites";

const height = Dimensions.get("screen").height;
const Home = () => {
  const queryClient = useQueryClient();
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);
  const [isAdding, setAdding] = useState(false);
  const [value, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState<string>("");
  const [audio, setAudio] = useState<AudioData>();
  const [audioSound, setAudioSound] = useState<AudioPlay | null>(null);

  const navigation = useNavigation<NavigationProp<DashboardTypes>>();

  // Always call useAudioPlayer, even if audioSound is null
  const {
    duration,
    formatTime,
    handleSeek,
    isPlaying,
    playPauseAudio,
    position,
    setPosition,
    isLoading,
  } = useAudioPlayer(audioSound?.file || "");

  const { createHistory } = useHistory();

  const { profile } = useSelector(authState);

  const {
    data,
    error,
    isLoading: isLatestLoading,
    isError,
  } = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchLatest(queryClient, showToast),
  });

  const {
    data: recs,
    error: recError,
    isLoading: isRecLoading,
    isError: isRecError,
  } = useQuery({
    queryKey: ["recommends"],
    queryFn: () => fetchRecommended(queryClient, showToast),
  });

  const {
    data: playlist,
    error: pError,
    isError: isPError,
  } = useQuery({
    queryKey: ["playlist"],
    queryFn: async () => {
      const result = await fetchPlaylistByProfile(queryClient, showToast);
      console.log("React Query Playlist Data:", result);
      return result;
    },
    enabled: isPlaylistModalShow,
    refetchInterval: isPlaylistModalShow ? 30000 : false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (isError) {
      showToast({ type: "error", message: error.message, title: "Error" });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isRecError) {
      showToast({ type: "error", message: recError.message, title: "Error" });
    }
  }, [isRecError, recError]);

  useEffect(() => {
    if (isPError) {
      showToast({ type: "error", message: pError?.message, title: "Error" });
    }
  }, [isPError, pError]);

  useEffect(() => {
    if (isPlaying && audioSound?.id) {
      postHistory(audioSound.id);
    }
  }, [isPlaying, audioSound?.id]);

  const { mutate: toggleFavorite } = useToggleFavorite();

  async function postHistory(audioId: string) {
    await createHistory({
      audio: audioId,
      date: new Date().toISOString(),
      progress: position,
    });
  }

  if (isLatestLoading || isRecLoading) {
    return (
      <View style={styles.loadWrapper}>
        <ActivityIndicator />
      </View>
    );
  }

  const handleModalShow = () => {
    setModalShow(!isModalShow);
  };

  const handleModalPlaylistShow = () => {
    setPlaylistModalShow(!isPlaylistModalShow);
  };

  const onPressAudio = async (item: AudioPlay) => {
    setAudioSound(item); // Update audioSound first
    if (item) {
      handleModalShow();
    }
  };

  function onPressRecentlyPlayed(item: AudioPlay) {
    setAudioSound(item); // Update audioSound first
    if (item) {
      handleModalShow();
    }
  }

  const onLongPressAudio = () => {
    handleModalShow();
  };

  const handleAddPlaylist = (item: any) => {
    handleModalPlaylistShow();
    setAudio(item);
  };

  const handleSubmit = async () => {
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
  };

  const onResetForm = () => {
    setAdding(false);
    setTitle("");
    setVisibility("public");
  };

  const onPlaylistPress = async (playlist: Playlist) => {
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
  };

  function navigationToProfile() {
    console.log(audioSound?.owner.id);
    console.log(profile?.id);
    handleModalShow();

    navigation.navigate("publicProfile", { profileId: audioSound?.owner.id });
  }
  return (
    <PaperProviders
      mainContentChildren={
        <ScrollView
          style={{ flex: 1, backgroundColor: "white", paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <ToastContainer>
            <Toast />
          </ToastContainer>
          <LatestUploads
            data={data}
            onAudioLongPress={onLongPressAudio}
            onAudioPress={onPressAudio}
          />
          <Recommended
            recs={recs}
            handlePlaylistAdd={handleAddPlaylist}
            OnAudioPress={onPressAudio}
          />

          <RecentlyPlayed onAudioPress={onPressRecentlyPlayed} />

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
          {audioSound && isPlaying && (
            <AudioPlayingComponent
              duration={duration}
              formatTime={formatTime}
              handleSeek={handleSeek}
              isPlaying
              playPauseAudio={playPauseAudio}
              position={position}
              setPosition={setPosition}
              audioCategory={audioSound.category}
              audioPoster={audioSound.poster as string}
              audioTitle={audioSound.title}
            />
          )}
        </ScrollView>
      }
    >
      <AudioModal isVisible={isModalShow}>
        <LinearGradient
          colors={["#AACBAE", "#3A5B3E", "#2A3D2C"]}
          style={[
            styles.background,
            {
              height: height,
              flex: 1,
              zIndex: 100,
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.align}>
            <IconButton
              icon={"close"}
              onPress={() => setModalShow(false)}
              style={{ backgroundColor: "white" }}
            />
          </View>
          <Image source={{ uri: audioSound?.poster }} style={styles.image} />
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text variant="displaySmall" style={styles.txtClr}>
              {audioSound?.title}
            </Text>
            <Text variant="bodySmall" style={styles.txtClr}>
              {audioSound?.category}
            </Text>
            {isLoading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <AudioProgressBarComponent
                duration={duration}
                handleSeek={handleSeek}
                isPlaying={isPlaying}
                playPauseAudio={playPauseAudio}
                position={position}
                setPosition={setPosition}
                formatTime={formatTime}
              />
            )}
          </View>

          <View
            style={{
              marginTop: 120,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <IconButton
              icon={"account-music-outline"}
              size={70}
              iconColor={"#FFFFFF"}
              onPress={navigationToProfile}
            />
            <IconButton
              icon={isPlaying ? "pause-circle" : "play-circle"}
              size={70}
              iconColor={"#FFFFFF"}
              onPress={playPauseAudio}
            />
            <IconButton
              icon={"account-heart"}
              size={70}
              iconColor={"#FFFFFF"}
              onPress={() => toggleFavorite(audioSound?.id as string)}
            />
          </View>
        </LinearGradient>
      </AudioModal>
    </PaperProviders>
  );

  // return (
  //   <PaperProviders
  //     mainContentChildren={
  //       <ScrollView
  //         contentContainerStyle={{ flex: 1, backgroundColor: "white" }}
  //         style={{ paddingBottom: 150 }}
  //         showsVerticalScrollIndicator={false}
  //         showsHorizontalScrollIndicator={false}
  //       >
  //         <ToastContainer>
  //           <Toast />
  //         </ToastContainer>
  //         <LatestUploads
  //           data={data}
  //           onAudioLongPress={onLongPressAudio}
  //           onAudioPress={onPressAudio}
  //         />
  //         <RecentlyPlayed />
  //         <Recommended
  //           recs={recs}
  //           handleFavAdd={handleAddFavorites}
  //           handlePlaylistAdd={handleAddPlaylist}
  //         />
  //         <PlaylistModal
  //           isPlaylistModalShow={isPlaylistModalShow}
  //           handleModalPlaylistShow={handleModalPlaylistShow}
  //           playlist={playlist}
  //           isAdding={isAdding}
  //           title={title}
  //           value={value}
  //           setAdding={() => setAdding(!isAdding)}
  //           setTitle={(val) => setTitle(val)}
  //           setVisibility={(val) => setVisibility(val)}
  //           handleSubmit={handleSubmit}
  //           onPlayListPress={onPlaylistPress}
  //         />
  //         {audioSound && isPlaying && (
  //           <AudioPlayingComponent
  //             duration={duration}
  //             formatTime={formatTime}
  //             handleSeek={handleSeek}
  //             isPlaying
  //             playPauseAudio={playPauseAudio}
  //             position={position}
  //             setPosition={setPosition}
  //             audioCategory={audioSound.category}
  //             audioPoster={audioSound.poster as string}
  //             audioTitle={audioSound.title}
  //           />
  //         )}
  //         <View style={{paddingBottom:150}}/>
  //       </ScrollView>
  //     }
  //   >
  //     <ModalComponent
  //       visible={isModalShow}
  //       onClose={handleModalShow}
  //       closeModal={handleModalShow}
  //       btnStyle={{ backgroundColor: "white" }}
  //     >
  //       <View
  //         style={{
  //           ...StyleSheet.absoluteFillObject,
  //           backgroundColor: "white",
  //           flex: 1,
  //           height: height,
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <LinearGradient
  //           colors={["#AACBAE", "#3A5B3E", "#2A3D2C"]}
  //           style={styles.background}
  //         >
  //           <Image source={{ uri: audioSound?.poster }} style={styles.image} />
  //           <View style={{ marginTop: 20, alignItems: "center" }}>
  //             <Text variant="displaySmall" style={styles.txtClr}>
  //               {audioSound?.title}
  //             </Text>
  //             <Text variant="bodySmall" style={styles.txtClr}>
  //               {audioSound?.category}
  //             </Text>
  //             {isLoading ? (
  //               <ActivityIndicator size="small" color="#0000ff" />
  //             ) : (
  //               <AudioProgressBarComponent
  //                 duration={duration}
  //                 handleSeek={handleSeek}
  //                 isPlaying={isPlaying}
  //                 playPauseAudio={playPauseAudio}
  //                 position={position}
  //                 setPosition={setPosition}
  //                 formatTime={formatTime}
  //               />
  //             )}
  //           </View>

  //           <View
  //             style={{
  //               marginTop: 120,
  //               alignItems: "center",
  //               flexDirection: "row",
  //             }}
  //           >
  //             <IconButton
  //               icon={"stop-circle"}
  //               size={70}
  //               iconColor={white[50]}
  //               onPress={() => {}}
  //             />
  //             <IconButton
  //               icon={"play-circle"}
  //               size={70}
  //               iconColor={white[50]}
  //               onPress={playPauseAudio}
  //             />
  //             <IconButton
  //               icon={"pause-circle"}
  //               size={70}
  //               iconColor={white[50]}
  //               onPress={() => {}}
  //             />
  //           </View>
  //         </LinearGradient>
  //       </View>
  //     </ModalComponent>
  //   </PaperProviders>
  // );
};

const styles = StyleSheet.create({
  loadWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: 300,
    objectFit: "cover",
    borderRadius: 10,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: height,
  },
  txtClr: {
    color: "white",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  time: {
    color: "white",
    fontSize: 14,
  },
  playButton: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  align: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    zIndex: 100,
    position: "absolute",
    top: Platform.OS === "android" ? 0 : 45,
    right: 0,
  },
});

export default Home;
