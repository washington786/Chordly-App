// import {
//   Dimensions,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import {
//   fetchLatest,
//   fetchPlaylistByProfile,
//   fetchRecommended,
// } from "@hooks/query";
// import {
//   ActivityIndicator,
//   Button,
//   IconButton,
//   Text,
//   ToggleButton,
// } from "react-native-paper";
// import { showToast } from "@utils/Toast";
// import { cod_gray, white } from "@styles/Colors";
// import LatestUploads from "@components/app/home/LatestUploads";
// import Recommended from "@components/app/home/Recommended";
// import PaperProviders from "@components/app/PaperProvider";
// import ModalComponent from "@components/app/ModalComponent";
// import client from "src/api/client";
// import { isAxiosError } from "axios";
// import { fetchFromStorage } from "@utils/AsyncStorage";
// import { Keys } from "@utils/enums";
// import { AudioData, Playlist } from "src/@types/Audios";

// import Icons from "react-native-vector-icons/Feather";
// import Input from "@components/auth/Input";
// import { Audio } from "expo-av";
// import ToastContainer from "@components/app/ToastContainer";
// import { LinearGradient } from "expo-linear-gradient";
// import TrackPlayer, { useProgress } from "react-native-track-player";
// import Slider from "@react-native-community/slider";
// import AudioProgressBarComponent from "@components/AudioProgressBarComponent";
// import useAudio from "@hooks/audioHook";

// const Home = () => {
//   const height = Dimensions.get("screen").height;
//   const queryClient = useQueryClient();
//   const [isModalShow, setModalShow] = useState<boolean>(false);
//   const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);

//   const [isAdding, setAdding] = useState(false);
//   const [value, setVisibility] = useState<"public" | "private">("public");
//   const [title, setTitle] = useState<string>("");
//   const [audio, setAudio] = useState<AudioData>();

//   const [audioSound, setAudioSound] = useState<AudioData>();

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
//       console.log("React Query Playlist Data:", result); // ✅ Debugging
//       return result;
//     },
//     enabled: isPlaylistModalShow, // ✅ Fetch only when modal is open
//     refetchInterval: isPlaylistModalShow ? 30000 : false, // ✅ Refresh every 30s
//     refetchOnWindowFocus: true, // ✅ Auto-refetch when app is back in focus
//     staleTime: 0, // ✅ Forces fresh data on every fetch
//   });

//   // console.log(playlist);

//   useEffect(() => {
//     if (isError) {
//       showToast({ type: "error", message: error.message, title: "Error" });
//     }
//   }, [isError, error, showToast]);

//   useEffect(() => {
//     if (isRecError) {
//       showToast({ type: "error", message: recError.message, title: "Error" });
//     }
//   }, [isRecError, recError, showToast]);

//   useEffect(() => {
//     if (isPError) {
//       showToast({ type: "error", message: pError?.message, title: "Error" });
//     }
//   }, [isPError, pError, showToast]);

//   if (isLoading || loadingRecs) {
//     return (
//       <View style={styles.loadWrapper}>
//         <ActivityIndicator />
//       </View>
//     );
//   }

//   function handleModalShow() {
//     setModalShow(!isModalShow);
//   }

//   function handleModalPlaylistShow() {
//     setPlaylistModalShow(!isPlaylistModalShow);
//   }

//   const {
//     duration,
//     isPlaying,
//     playPauseAudio,
//     pauseSound,
//     stopSound,
//     position,
//     handleSeek,
//     setPosition,
//     loadAudio,
//     playSound,
//   } = useAudio();

//   function onPressAudio(item: AudioData) {
//     setAudioSound(item);
//     if (audioSound) {
//       handleModalShow();
//       loadAudio(item.audio);
//     }
//   }

//   function onLongPressAudio() {
//     handleModalShow();
//   }

//   async function handleAddFavorites(item: any) {
//     const token = await fetchFromStorage(Keys.AUTH_TOKEN);
//     try {
//       const { id } = item;

//       const { data } = await client.post(
//         `/favorites/?audioId=${id}`,
//         {}, // Empty body
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
//       // if (status === 201) {
//       // }
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
//   }

//   function handleAddPlaylist(item: any) {
//     handleModalPlaylistShow();
//     setAudio(item);
//   }

//   async function handleSubmit() {
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
//       // mutate();
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
//   }

//   function onResetForm() {
//     setAdding(false);
//     setTitle("");
//     setVisibility("public");
//   }

//   async function onPlaylistPress(playlist: Playlist) {
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
//   }

//   return (
//     <PaperProviders
//       mainContentChildren={
//         <View>
//           <ToastContainer>
//             <Toast />
//           </ToastContainer>
//           <LatestUploads
//             data={data}
//             onAudioLongPress={(item) => onLongPressAudio()}
//             onAudioPress={(item) => {
//               onPressAudio(item);
//               console.log(item);
//             }}
//           />
//           <Recommended
//             recs={recs}
//             handleFavAdd={handleAddFavorites}
//             handlePlaylistAdd={handleAddPlaylist}
//           />

//           {/* playlist modal */}
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
//             colors={["#AACBAE", "#3A5B3E", "#2A3D2C"]} // Gradient colors
//             style={styles.background}
//           >
//             <Image
//               source={{ uri: audioSound?.poster }} // Replace with your image URI
//               style={styles.image}
//             />
//             <View style={{ marginTop: 20, alignItems: "center" }}>
//               <Text variant="displaySmall" style={styles.txtClr}>
//                 {audioSound?.title}
//               </Text>
//               <Text variant="bodySmall" style={styles.txtClr}>
//                 {audioSound?.category}
//               </Text>
//               <ProgressBarComponent soundUrl={audio?.audio as string} />
//               {/* <AudioProgressBarComponent
//                 duration={duration}
//                 position={position}
//                 setPosition={setPosition}
//                 playPauseAudio={playPauseAudio}
//                 handleSeek={handleSeek}
//                 isPlaying={isPlaying}
//                 url={audio?.audio || audioSound?.audio}
//               /> */}
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
//                 onPress={stopSound}
//               />
//               <IconButton
//                 icon={"play-circle"}
//                 size={70}
//                 iconColor={white[50]}
//                 onPress={() => playSound(audioSound?.audio as string)}
//               />
//               <IconButton
//                 icon={"pause-circle"}
//                 size={70}
//                 iconColor={white[50]}
//                 onPress={pauseSound}
//               />
//             </View>
//           </LinearGradient>
//         </View>
//       </ModalComponent>
//     </PaperProviders>
//   );
// };

// interface playlistProps {
//   isPlaylistModalShow: boolean;
//   handleModalPlaylistShow(): void;
//   playlist: Playlist[]; // Ensure playlist is typed as an array
//   isAdding: boolean;
//   value: "public" | "private";
//   setVisibility(value: "public" | "private"): void;
//   title: string;
//   setTitle(value: string): void;
//   setAdding: (val: any) => void;
//   handleSubmit(): void;
//   onPlayListPress(playlist: Playlist): void;
// }

// function PlaylistModal({
//   isPlaylistModalShow,
//   handleModalPlaylistShow,
//   playlist = [], // Set a default value as an empty array
//   isAdding,
//   setTitle,
//   setVisibility,
//   title,
//   value,
//   setAdding,
//   handleSubmit,
//   onPlayListPress,
// }: playlistProps) {
//   return (
//     <ModalComponent
//       visible={isPlaylistModalShow}
//       onClose={handleModalPlaylistShow}
//       closeModal={handleModalPlaylistShow}
//     >
//       <View style={{ paddingHorizontal: 8 }}>
//         <Button
//           icon={"playlist-plus"}
//           uppercase
//           mode="contained-tonal"
//           onPress={() => setAdding((prev: any) => !prev)}
//         >
//           {isAdding ? "close form" : "add play-list"}
//         </Button>
//         {isAdding && (
//           <PlaylistForm
//             onChange={(val: "public" | "private") => setVisibility(val)}
//             value={value}
//             onSubmit={handleSubmit}
//             onValChange={(val) => setTitle(val)}
//             title={title}
//           />
//         )}

//         {!isAdding && playlist.length === 0 ? (
//           <Text>No playlists available</Text>
//         ) : (
//           <ScrollView>
//             {playlist.map((audio: Playlist) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() => onPlayListPress(audio)}
//                   key={audio.id}
//                   style={{
//                     backgroundColor: cod_gray[50],
//                     marginVertical: 5,
//                     paddingHorizontal: 6,
//                     paddingVertical: 8,
//                     borderRadius: 8,
//                     flexDirection: "row",
//                     alignItems: "center",
//                     rowGap: 8,
//                     gap: 8,
//                   }}
//                 >
//                   <Icons
//                     name={audio.visibility === "private" ? "lock" : "globe"}
//                     size={20}
//                     color={cod_gray[300]}
//                   />
//                   <Text>{audio.title}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         )}
//         <Toast />
//       </View>
//     </ModalComponent>
//   );
// }
// interface formProps {
//   value: "public" | "private";
//   onChange(value: string): void;
//   onSubmit(): void;
//   onValChange(value: string): void;
//   title: string;
// }
// function PlaylistForm({
//   onChange,
//   value,
//   onSubmit,
//   title,
//   onValChange,
// }: formProps) {
//   return (
//     <View>
//       <Input
//         placeholder="title"
//         style={{ borderColor: "gray", borderWidth: 1, marginVertical: 5 }}
//         placeholderTextColor={"gray"}
//         contentStyle={{ color: "gray" }}
//         onChangeText={onValChange}
//         value={title}
//       />
//       <View style={{ paddingVertical: 5 }}>
//         <Text>Select Visibility Type</Text>
//         <ToggleButton.Row value={value} onValueChange={onChange}>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginHorizontal: 4,
//               paddingVertical: 5,
//             }}
//           >
//             <ToggleButton icon={"earth"} value="public" />
//             <Text>Public</Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginHorizontal: 4,
//               paddingVertical: 5,
//             }}
//           >
//             <ToggleButton icon={"lock"} value="private" />
//             <Text>Private</Text>
//           </View>
//         </ToggleButton.Row>
//       </View>
//       <Button uppercase mode="contained" onPress={onSubmit}>
//         Create
//       </Button>
//     </View>
//   );
// }

// interface Prop {
//   soundUrl: string;
// }

// function ProgressBarComponent({ soundUrl }: Prop) {
//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(1);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const soundRef = useRef<Audio.Sound | null>(null); // ✅ Fix here
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const loadAndSetAudio = async () => {
//       await loadAudio();
//     };

//     loadAndSetAudio();

//     return () => {
//       cleanupAudio();
//     };
//   }, [soundUrl]);

//   useEffect(() => {
//     if (isPlaying) {
//       startTrackingProgress();
//     }
//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [isPlaying]);

//   const loadAudio = async () => {
//     try {
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: false,
//         playsInSilentModeIOS: true,
//         staysActiveInBackground: true,
//         shouldDuckAndroid: true,
//         playThroughEarpieceAndroid: false,
//       });

//       const { sound, status } = await Audio.Sound.createAsync(
//         { uri: soundUrl },
//         { shouldPlay: false }
//       );

//       soundRef.current = sound; // ✅ Fix here
//       setDuration(status.isLoaded ? status.durationMillis / 1000 : 1);

//       sound.setOnPlaybackStatusUpdate((status) => {
//         if (status.isLoaded) {
//           setPosition(status.positionMillis / 1000);
//           if (status.didJustFinish) {
//             setIsPlaying(false);
//             setPosition(0);
//           }
//         }
//       });
//     } catch (error) {
//       console.error("Error loading audio:", error);
//     }
//   };

//   const cleanupAudio = async () => {
//     if (soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }
//   };

//   const playPauseAudio = async () => {
//     if (!soundRef.current) {
//       console.error("Sound instance is missing");
//       return;
//     }

//     const status = await soundRef.current.getStatusAsync();
//     if (!status.isLoaded) {
//       console.error("Audio is not loaded yet");
//       return;
//     }

//     if (status.isPlaying) {
//       await soundRef.current.pauseAsync();
//       setIsPlaying(false);
//     } else {
//       await soundRef.current.playAsync();
//       setIsPlaying(true);
//     }
//   };

//   const startTrackingProgress = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);

//     intervalRef.current = setInterval(async () => {
//       if (soundRef.current) {
//         const status = await soundRef.current.getStatusAsync();
//         if (status.isLoaded) {
//           setPosition(status.positionMillis / 1000);
//         }
//       }
//     }, 1000);
//   };

//   const handleSeek = async (value: number) => {
//     if (soundRef.current) {
//       await soundRef.current.setPositionAsync(value * 1000);
//       setPosition(value);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.time}>{formatTime(position)}</Text>
//       <Slider
//         style={styles.slider}
//         minimumValue={0}
//         maximumValue={duration}
//         value={position}
//         onSlidingComplete={handleSeek}
//         minimumTrackTintColor="#3A5B3E"
//         maximumTrackTintColor="#AACBAE"
//         thumbTintColor="#2A3D2C"
//       />
//       <Text style={styles.time}>{formatTime(duration)}</Text>
//       <Text onPress={playPauseAudio} style={styles.playButton}>
//         {isPlaying ? "Pause" : "Play"}
//       </Text>
//     </View>
//   );
// }

// export default Home;

// const styles = StyleSheet.create({
//   loadWrapper: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.4)",
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   imageBackground: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
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

//   // progressBar
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
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  fetchLatest,
  fetchPlaylistByProfile,
  fetchRecommended,
} from "@hooks/query";
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  ToggleButton,
} from "react-native-paper";
import { showToast } from "@utils/Toast";
import { cod_gray, white } from "@styles/Colors";
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
import { Audio } from "expo-av";
import ToastContainer from "@components/app/ToastContainer";
import { LinearGradient } from "expo-linear-gradient";
import Slider from "@react-native-community/slider";

const Home = () => {
  const height = Dimensions.get("screen").height;
  const queryClient = useQueryClient();
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isPlaylistModalShow, setPlaylistModalShow] = useState<boolean>(false);
  const [isAdding, setAdding] = useState(false);
  const [value, setVisibility] = useState<"public" | "private">("public");
  const [title, setTitle] = useState<string>("");
  const [audio, setAudio] = useState<AudioData>();
  const [audioSound, setAudioSound] = useState<AudioData>();

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

  if (isLoading || loadingRecs) {
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

  const onPressAudio = (item: AudioData) => {
    setAudioSound(item);
    if (item) {
      handleModalShow();
    }
    // else {
    //   showToast({
    //     type: "error",
    //     message: "Invalid audio source",
    //     title: "Error",
    //   });
    // }
  };
  console.log(audioSound);
  console.log(data);

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

              {data.audios
                .filter((aud: AudioData) => aud.id === audioSound?.id)
                .map((aud: AudioData) => (
                  <ProgressBarComponent
                    key={aud.id}
                    soundUrl={aud.audio as string}
                  />
                ))}
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
                onPress={() => {}}
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
        <Toast />
      </View>
    </ModalComponent>
  );
};

interface PlaylistFormProps {
  value: "public" | "private";
  onChange: (value: "public" | "private") => void;
  onSubmit: () => void;
  onValChange: (value: string) => void;
  title: string;
}

const PlaylistForm = ({
  onChange,
  value,
  onSubmit,
  title,
  onValChange,
}: PlaylistFormProps) => {
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
};

interface ProgressBarComponentProps {
  soundUrl: string;
}

const ProgressBarComponent = ({ soundUrl }: ProgressBarComponentProps) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadAndSetAudio = async () => {
      await loadAudio();
    };
    loadAndSetAudio();
    return () => {
      cleanupAudio();
    };
  }, [soundUrl]);

  const loadAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: soundUrl },
        { shouldPlay: false }
      );
      soundRef.current = sound;
      setDuration(status.isLoaded ? status.durationMillis / 1000 : 1);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis / 1000);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  const cleanupAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const playPauseAudio = async () => {
    if (!soundRef.current) {
      console.error("Sound instance is missing");
      return;
    }
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) {
      console.error("Audio is not loaded yet");
      return;
    }
    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value * 1000);
      setPosition(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(position)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSeek}
        minimumTrackTintColor="#3A5B3E"
        maximumTrackTintColor="#AACBAE"
        thumbTintColor="#2A3D2C"
      />
      <Text style={styles.time}>{formatTime(duration)}</Text>
      <Text onPress={playPauseAudio} style={styles.playButton}>
        {isPlaying ? "Pause" : "Play"}
      </Text>
    </View>
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
