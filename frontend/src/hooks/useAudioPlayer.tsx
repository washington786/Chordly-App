import { useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";

const useAudioPlayer = (soundUrl: string) => {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load the audio when the soundUrl changes
  useEffect(() => {
    const loadAndSetAudio = async () => {
      await loadAudio();
    };

    if (soundUrl) {
      loadAndSetAudio();
    }

    return () => {
      cleanupAudio();
    };
  }, [soundUrl]);

  // Load the audio file
  const loadAudio = async () => {
    setIsLoading(true);
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

      // Update the position as the audio plays
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
      setIsLoading(false);
      console.error("Error loading audio:", error);
    }
    setIsLoading(false);
  };

  // Clean up the audio instance
  const cleanupAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // Play or pause the audio
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

  // Seek to a specific position in the audio
  const handleSeek = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value * 1000);
      setPosition(value);
    }
  };

  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    position,
    duration,
    isPlaying,
    playPauseAudio,
    handleSeek,
    formatTime,
    setPosition,
    isLoading,
  };
};

export default useAudioPlayer;
