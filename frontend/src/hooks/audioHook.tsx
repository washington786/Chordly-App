// // export default useAudio;
// import { useEffect, useRef, useState } from "react";
// import { Audio } from "expo-av";

// const useAudio = (url: string) => {
//   const sound = useRef(new Audio.Sound());
//   const [position, setPosition] = useState(0);
//   const [duration, setDuration] = useState(1);
//   const [isPlaying, setIsPlaying] = useState(false);

//   //   useEffect(() => {
//   //     if (!url) return; // Prevent loading if URL is missing
//   //     loadAudio(url);
//   //     return () => {
//   //       sound.current.unloadAsync();
//   //     };
//   //   }, [url]);

//   const loadAudio = async (audio_uri:string) => {
//     if (!url) {
//       console.error("Audio URL is missing. Skipping load.");
//       return;
//     }

//     try {
//       await sound.current.loadAsync({ uri: audio_uri }, {}, true);
//       const status = await sound.current.getStatusAsync();
//       setDuration(status.durationMillis / 1000);
//     } catch (error) {
//       console.error("Error loading audio", error);
//     }
//   };

//   // Track progress of the audio
//   const trackProgress = () => {
//     setInterval(async () => {
//       const status = await sound.current.getStatusAsync();
//       if (status.isLoaded) {
//         setPosition(status.positionMillis / 1000); // Update position
//       }
//     }, 1000);
//   };

//   // Play or pause the audio
//   const playPauseAudio = async () => {
//     const status = await sound.current.getStatusAsync();
//     if (status.isLoaded) {
//       if (status.isPlaying) {
//         await sound.current.pauseAsync();
//         setIsPlaying(false);
//       } else {
//         await sound.current.playAsync();
//         setIsPlaying(true);
//         trackProgress(); // Start tracking progress when playing
//       }
//     } else {
//       console.error("Sound is not loaded, cannot play/pause.");
//     }
//   };

//   // Play the audio
//   const playSound = async (sound_uri: string) => {
//     try {
//       const { sound: newSound } = await Audio.Sound.createAsync(
//         { uri: sound_uri },
//         { shouldPlay: true }
//       );
//       sound.current = newSound;
//       setIsPlaying(true);
//       trackProgress();
//     } catch (error) {
//       console.error("Error playing sound", error);
//     }
//   };

//   // Pause the sound
//   const pauseSound = async () => {
//     try {
//       const status = await sound.current.getStatusAsync();
//       if (status.isLoaded && status.isPlaying) {
//         await sound.current.pauseAsync();
//         setIsPlaying(false);
//       } else {
//         console.error(
//           "Cannot pause because sound is not playing or not loaded."
//         );
//       }
//     } catch (error) {
//       console.error("Error pausing sound", error);
//     }
//   };

//   // Stop the sound
//   const stopSound = async () => {
//     try {
//       const status = await sound.current.getStatusAsync();
//       if (status.isLoaded) {
//         await sound.current.stopAsync();
//         setIsPlaying(false);
//         setPosition(0); // Reset position when stopping
//       } else {
//         console.error("Cannot stop because sound is not loaded.");
//       }
//     } catch (error) {
//       console.error("Error stopping sound", error);
//     }
//   };

//   // Seek to a specific position in the audio
//   const handleSeek = async (value: number) => {
//     try {
//       await sound.current.setPositionAsync(value * 1000);
//       setPosition(value);
//     } catch (error) {
//       console.error("Error seeking audio", error);
//     }
//   };

//   // Format time into minutes:seconds
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   return {
//     sound,
//     position,
//     duration,
//     isPlaying,
//     formatTime,
//     handleSeek,
//     playPauseAudio,
//     pauseSound,
//     stopSound,
//     playSound,
//     setPosition,
//     loadAudio,
//   };
// };

// export default useAudio;
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

const useAudio = () => {
  const sound = useRef(new Audio.Sound());
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false); // Track if audio is loaded

  // 🔹 Load a new audio file dynamically
  const loadAudio = async (audio_uri: string) => {
    if (!audio_uri) {
      console.error("Audio URL is missing. Skipping load.");
      return;
    }

    try {
      if (loaded) {
        await sound.current.unloadAsync(); // Unload previous audio
      }

      await sound.current.loadAsync({ uri: audio_uri }, {}, true);
      const status = await sound.current.getStatusAsync();
      setDuration(status.durationMillis / 1000); // Convert duration to seconds
      setLoaded(true);
    } catch (error) {
      console.error("Error loading audio", error);
    }
  };

  // 🔹 Play or pause the audio
  const playPauseAudio = async () => {
    if (!loaded) return;

    const status = await sound.current.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await sound.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.current.playAsync();
        setIsPlaying(true);
        trackProgress();
      }
    }
  };

  // 🔹 Track audio progress
  const trackProgress = () => {
    setInterval(async () => {
      if (!loaded) return;
      const status = await sound.current.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis / 1000);
      }
    }, 1000);
  };

  // 🔹 Pause the audio
  const pauseSound = async () => {
    if (!loaded) return;
    await sound.current.pauseAsync();
    setIsPlaying(false);
  };

  // 🔹 Stop the audio
  const stopSound = async () => {
    if (!loaded) return;
    await sound.current.stopAsync();
    setIsPlaying(false);
    setPosition(0);
  };

  const playSound = async (audio_uri: string) => {
    if (!audio_uri) return;

    try {
      if (loaded) {
        await sound.current.unloadAsync();
      }

      await sound.current.loadAsync({ uri: audio_uri }, { shouldPlay: true });
      setIsPlaying(true);
      trackProgress();
      setLoaded(true);
    } catch (error) {
      console.error("Error playing sound", error);
    }
  };

  // 🔹 Seek to a specific position in the audio
  const handleSeek = async (value: number) => {
    if (!loaded) return;
    await sound.current.setPositionAsync(value * 1000);
    setPosition(value);
  };

  // 🔹 Format time into MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    position,
    duration,
    isPlaying,
    formatTime,
    handleSeek,
    playPauseAudio,
    pauseSound,
    stopSound,
    setPosition,
    loadAudio,
    playSound
  };
};

export default useAudio;

