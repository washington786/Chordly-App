import { CategoryTypes } from "./../../../server/src/utils/audio_categories";

export interface AudioData {
  id: number;
  title: string;
  about: string;
  category: CategoryTypes;
  audio: string;
  poster?: string | undefined;
  owner: {
    name: string;
    id: string;
  };
}

export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: "public" | "private" | "auto";
}
