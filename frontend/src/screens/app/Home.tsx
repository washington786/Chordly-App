// import { Dimensions, Image, StyleSheet, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import {
//   fetchLatest,
//   fetchPlaylistByProfile,
//   fetchRecommended,
// } from "@hooks/query";
// import { ActivityIndicator, IconButton, Text } from "react-native-paper";
// import { showToast } from "@utils/Toast";
// import { white } from "@styles/Colors";
// import LatestUploads from "@components/app/home/LatestUploads";
// import Recommended from "@components/app/home/Recommended";
// import PaperProviders from "@components/app/PaperProvider";
// import ModalComponent from "@components/app/ModalComponent";
// import client from "src/api/client";
// import { isAxiosError } from "axios";
// import { fetchFromStorage } from "@utils/AsyncStorage";
// import { Keys } from "@utils/enums";
// import { AudioData, AudioPlay, Playlist } from "src/@types/Audios";
// import ToastContainer from "@components/app/ToastContainer";
// import { LinearGradient } from "expo-linear-gradient";
// import PlaylistModal from "@components/app/PlaylistModal";
// import AudioProgressBarComponent from "@components/AudioProgressBarComponent";
// import useAudioPlayer from "@hooks/useAudioPlayer";
// import AudioPlayingComponent from "@components/app/home/AudioPlayingComponent";

// const Home = () => {
//   const height = Dimensions.get("screen").height;
//   const queryClient = useQueryClient();
//   const [isModalShow, setModalShow] = useState<boolean>(false);
//   const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);
//   const [isAdding, setAdding] = useState(false);
//   const [value, setVisibility] = useState<"public" | "private">("public");
//   const [title, setTitle] = useState<string>("");
//   const [audio, setAudio] = useState<AudioData>();
//   const [audioSound, setAudioSound] = useState<AudioPlay>();

//   const { data, error, isLoading, isError } = useQuery({
//     queryKey: ["latest"],
//     queryFn: () => fetchLatest(queryClient, showToast),
//   });

//   const {
//     data: recs,
//     error: recError,
//     isLoading: loadingRecs,
//     isError: isRecError,
//   } = useQuery({
//     queryKey: ["recommends"],
//     queryFn: () => fetchRecommended(queryClient, showToast),
//   });

//   const {
//     data: playlist,
//     error: pError,
//     isLoading: pIsLoading,
//     isError: isPError,
//     refetch,
//   } = useQuery({
//     queryKey: ["playlist"],
//     queryFn: async () => {
//       const result = await fetchPlaylistByProfile(queryClient, showToast);
//       console.log("React Query Playlist Data:", result);
//       return result;
//     },
//     enabled: isPlaylistModalShow,
//     refetchInterval: isPlaylistModalShow ? 30000 : false,
//     refetchOnWindowFocus: true,
//     staleTime: 0,
//   });

//   useEffect(() => {
//     if (isError) {
//       showToast({ type: "error", message: error.message, title: "Error" });
//     }
//   }, [isError, error]);

//   useEffect(() => {
//     if (isRecError) {
//       showToast({ type: "error", message: recError.message, title: "Error" });
//     }
//   }, [isRecError, recError]);

//   useEffect(() => {
//     if (isPError) {
//       showToast({ type: "error", message: pError?.message, title: "Error" });
//     }
//   }, [isPError, pError]);

//   if (isLoading || loadingRecs) {
//     return (
//       <View style={styles.loadWrapper}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   const handleModalShow = () => {
//     setModalShow(!isModalShow);
//   };

//   const handleModalPlaylistShow = () => {
//     setPlaylistModalShow(!isPlaylistModalShow);
//   };

//   const onPressAudio = (item: AudioPlay) => {
//     setAudioSound(item);
//     if (item) {
//       handleModalShow();
//     }
//   };
//   const {
//     duration,
//     formatTime,
//     handleSeek,
//     isPlaying,
//     playPauseAudio,
//     position,
//     setPosition,
//   } = useAudioPlayer(audioSound?.file as string);

//   const onLongPressAudio = () => {
//     handleModalShow();
//   };

//   const handleAddFavorites = async (item: any) => {
//     const token = await fetchFromStorage(Keys.AUTH_TOKEN);
//     try {
//       const { id } = item;
//       const { data } = await client.post(
//         `/favorites/?audioId=${id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       showToast({
//         message: "Added to favorites",
//         title: "Success",
//         type: "success",
//       });
//       console.log("added: ", data);
//     } catch (error) {
//       let errorMessage = "An error occurred";
//       if (isAxiosError(error)) {
//         errorMessage = error.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       console.log(errorMessage);
//       showToast({ message: errorMessage, title: "Error", type: "error" });
//     }
//   };

//   const handleAddPlaylist = (item: any) => {
//     handleModalPlaylistShow();
//     setAudio(item);
//   };

//   const handleSubmit = async () => {
//     try {
//       if (!title.trim()) {
//         showToast({
//           message: "title is required",
//           title: "Error",
//           type: "error",
//         });
//         return;
//       }
//       const token = await fetchFromStorage(Keys.AUTH_TOKEN);
//       const { data } = await client.post(
//         "/playlist/create",
//         {
//           title: title,
//           visibility: value,
//           resourceId: audio?.id,
//         },
//         { headers: { Authorization: "Bearer " + token } }
//       );
//       console.log(data);
//       showToast({
//         message: "Created Playlist",
//         title: "Success",
//         type: "success",
//       });
//     } catch (error) {
//       let errorMessage = "An error occurred";
//       if (isAxiosError(error)) {
//         errorMessage = error.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       console.log(errorMessage);
//       showToast({ message: errorMessage, title: "Error", type: "error" });
//     }
//     onResetForm();
//   };

//   const onResetForm = () => {
//     setAdding(false);
//     setTitle("");
//     setVisibility("public");
//   };

//   const onPlaylistPress = async (playlist: Playlist) => {
//     try {
//       const { data } = await client.patch(
//         "/playlist",
//         {
//           id: playlist.id,
//           item: audio?.id,
//           title: audio?.title,
//           visibility: playlist.visibility,
//         },
//         {
//           headers: {
//             Authorization:
//               "Bearer " + (await fetchFromStorage(Keys.AUTH_TOKEN)),
//           },
//         }
//       );
//       showToast({
//         message: "audio added to " + playlist.title,
//         title: "success",
//         type: "success",
//       });
//       console.log(data);
//       setTimeout(() => {
//         setPlaylistModalShow(false);
//         setAudio(undefined);
//       }, 3000);
//     } catch (error) {
//       let errorMessage = "Sorry, something just happened";
//       if (isAxiosError(error)) {
//         errorMessage = error.response?.data.message;
//       } else if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       showToast({ message: errorMessage, title: "Error", type: "error" });
//     }
//   };

//   return (
//     <PaperProviders
//       mainContentChildren={
//         <View>
//           <ToastContainer>
//             <Toast />
//           </ToastContainer>
//           <LatestUploads
//             data={data}
//             onAudioLongPress={onLongPressAudio}
//             onAudioPress={onPressAudio}
//           />
//           <Recommended
//             recs={recs}
//             handleFavAdd={handleAddFavorites}
//             handlePlaylistAdd={handleAddPlaylist}
//           />
//           <PlaylistModal
//             isPlaylistModalShow={isPlaylistModalShow}
//             handleModalPlaylistShow={handleModalPlaylistShow}
//             playlist={playlist}
//             isAdding={isAdding}
//             title={title}
//             value={value}
//             setAdding={() => setAdding(!isAdding)}
//             setTitle={(val) => setTitle(val)}
//             setVisibility={(val) => setVisibility(val)}
//             handleSubmit={handleSubmit}
//             onPlayListPress={onPlaylistPress}
//           />
//           <AudioPlayingComponent />
//         </View>
//       }
//     >
//       <ModalComponent
//         visible={isModalShow}
//         onClose={handleModalShow}
//         closeModal={handleModalShow}
//         btnStyle={{ backgroundColor: "white" }}
//       >
//         <View
//           style={{
//             ...StyleSheet.absoluteFillObject,
//             backgroundColor: "white",
//             flex: 1,
//             height: height,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <LinearGradient
//             colors={["#AACBAE", "#3A5B3E", "#2A3D2C"]}
//             style={styles.background}
//           >
//             <Image source={{ uri: audioSound?.poster }} style={styles.image} />
//             <View style={{ marginTop: 20, alignItems: "center" }}>
//               <Text variant="displaySmall" style={styles.txtClr}>
//                 {audioSound?.title}
//               </Text>

//               <Text variant="bodySmall" style={styles.txtClr}>
//                 {audioSound?.category}
//               </Text>

//               <AudioProgressBarComponent
//                 duration={duration}
//                 handleSeek={handleSeek}
//                 isPlaying={isPlaying}
//                 playPauseAudio={playPauseAudio}
//                 position={position}
//                 setPosition={setPosition}
//                 formatTime={formatTime}
//               />
//             </View>
//             <View
//               style={{
//                 marginTop: 120,
//                 alignItems: "center",
//                 flexDirection: "row",
//               }}
//             >
//               <IconButton
//                 icon={"stop-circle"}
//                 size={70}
//                 iconColor={white[50]}
//                 onPress={() => {}}
//               />
//               <IconButton
//                 icon={"play-circle"}
//                 size={70}
//                 iconColor={white[50]}
//                 onPress={() => {}}
//               />
//               <IconButton
//                 icon={"pause-circle"}
//                 size={70}
//                 iconColor={white[50]}
//                 onPress={() => {}}
//               />
//             </View>
//           </LinearGradient>
//         </View>
//       </ModalComponent>
//     </PaperProviders>
//   );
// };

// const styles = StyleSheet.create({
//   loadWrapper: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   image: {
//     width: "90%",
//     height: 300,
//     objectFit: "cover",
//     borderRadius: 10,
//   },
//   background: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//   },
//   txtClr: {
//     color: "white",
//   },
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "90%",
//     alignSelf: "center",
//     marginTop: 10,
//   },
//   slider: {
//     flex: 1,
//     marginHorizontal: 10,
//   },
//   time: {
//     color: "white",
//     fontSize: 14,
//   },
//   playButton: {
//     color: "white",
//     fontSize: 16,
//     marginLeft: 10,
//   },
// });

// export default Home;

import { Dimensions, Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
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
  white,
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
import ProgressBarComponent from "@components/app/ProgressBar";
import useHistory from "@hooks/useHistory";

const Home = () => {
  const height = Dimensions.get("screen").height;
  const queryClient = useQueryClient();
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);
  const [isAdding, setAdding] = useState(false);
  const [value, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState<string>("");
  const [audio, setAudio] = useState<AudioData>();
  const [audioSound, setAudioSound] = useState<AudioPlay | null>(null); // Initialize as null

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
    isLoading: isPlaylistLoading,
    isError: isPError,
    refetch,
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
  }, [isPlaying, audioSound?.id]); // Runs only when `isPlaying` or `audioSound.id` changes

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

  

  const onLongPressAudio = () => {
    handleModalShow();
  };

  const handleAddFavorites = async (item: any) => {
    const token = await fetchFromStorage(Keys.AUTH_TOKEN);
    try {
      const { id } = item;
      const { data } = await client.post(
        `/favorites/?audioId=${id}`,
        {},
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

  return (
    <PaperProviders
      mainContentChildren={
        <View>
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
            handleFavAdd={handleAddFavorites}
            handlePlaylistAdd={handleAddPlaylist}
          />
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
        </View>
      }
    >
      <ModalComponent
        visible={isModalShow}
        onClose={handleModalShow}
        closeModal={handleModalShow}
        btnStyle={{ backgroundColor: "white" }}
      >
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "white",
            flex: 1,
            height: height,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LinearGradient
            colors={["#AACBAE", "#3A5B3E", "#2A3D2C"]}
            style={styles.background}
          >
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
                icon={"stop-circle"}
                size={70}
                iconColor={white[50]}
                onPress={() => {}}
              />
              <IconButton
                icon={"play-circle"}
                size={70}
                iconColor={white[50]}
                onPress={playPauseAudio}
              />
              <IconButton
                icon={"pause-circle"}
                size={70}
                iconColor={white[50]}
                onPress={() => {}}
              />
            </View>
          </LinearGradient>
        </View>
      </ModalComponent>
    </PaperProviders>
  );
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
});

export default Home;
