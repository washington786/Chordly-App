import { useQuery } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import { isAxiosError } from "axios";
import { getClient } from "src/api/client";

const fetchPublicProfile = async (id: string) => {
  try {
    const client = await getClient();
    const { data } = await client.get(`/profile/profileInfo/${id}`);
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
};

export function useFetchPublicProfile(id: string) {
  return useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => fetchPublicProfile(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
}

const fetchPublicProfileUploads = async (id: string) => {
  try {
    const client = await getClient();
    const { data } = await client.get(`/profile/uploads/${id}`);
    return data.audios ?? [];
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
};
export function useFetchPublicProfileUploads(id: string) {
  return useQuery({
    queryKey: ["public-uploads", id],
    queryFn: () => fetchPublicProfileUploads(id),
    enabled: !!id,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
}

const fetchPublicProfilePlaylist = async () => {
  try {
    const client = await getClient();
    const { data } = await client.get(`/playlist/by-profile`);
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
};

export function useFetchPublicProfilePlaylist() {
  return useQuery({
    queryKey: ["public-playlist"],
    queryFn: fetchPublicProfilePlaylist,
    retry: 2,
    staleTime: 1000 * 60 * 10,
  });
}
