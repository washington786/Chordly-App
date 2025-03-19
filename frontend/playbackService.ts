import TrackPlayer, { Event } from 'react-native-track-player';

async function playbackService() {
  // Start playback when the remote play event is triggered
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    // Start the track when play is pressed
    await TrackPlayer.play();
  });

  // You can also listen to other events like pause, stop, etc.
  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    // Pause the track when pause is pressed
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    // Stop the track when stop is pressed
    await TrackPlayer.stop();
  });
}

export default playbackService;
