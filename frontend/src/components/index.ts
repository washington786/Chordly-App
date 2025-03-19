import PlaylistModal from "./app/PlaylistModal";
import AudioProgressBarComponent from "./AudioProgressBarComponent";
import useAudioPlayer from "@hooks/useAudioPlayer";
import AudioPlayingComponent from "./app/home/AudioPlayingComponent";

import LatestUploads from "./app/home/LatestUploads";
import Recommended from "./app/home/Recommended";
import PaperProviders from "./app/PaperProvider";
import ModalComponent from "./app/ModalComponent";

import { showToast } from "@utils/Toast";
import { white } from "@styles/Colors";

import ToastContainer from "./app/ToastContainer"; 

export {
  PlaylistModal,
  AudioProgressBarComponent,
  useAudioPlayer,
  AudioPlayingComponent,
  LatestUploads,
  Recommended,
  PaperProviders,
  ModalComponent,
  showToast,
  white,
  ToastContainer
};
