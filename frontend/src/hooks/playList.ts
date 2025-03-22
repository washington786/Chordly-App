import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import { isAxiosError } from "axios";
import { getClient } from "src/api/client";

async function fetchPlaylistAudios(id: string) {
  try {
    const client = await getClient();
    const { data } = await client.get(`/playlist-audios/${id}`);
    return data ?? [];
  } catch (error) {
    let errorMessage = "Sorry, something happened!";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    showToast({ message: errorMessage, title: "Error", type: "error" });
    throw new Error(errorMessage); // Ensure React Query handles the error properly
  }
}

export const useFetchPlaylistAudios = (id: string) => {
  return useQuery({
    queryKey: ["playlist-audios-public", id],
    queryFn: () => fetchPlaylistAudios(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
};
