import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import { isAxiosError } from "axios";
import { getClient } from "src/api/client";

const fetchUploadsByProfile = async () => {
  try {
    const client = await getClient();
    const { data } = await client.get("/profile/uploads");
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

export const useFetchedUploadsByProfile = () => {
  return useQuery({
    queryKey: ["uploads"],
    queryFn: fetchUploadsByProfile,
  });
};

const fetchFavorites = async () => {
  try {
    const client = await getClient();
    const { data } = await client.get("/favorites/");
    return data?.audios ?? []; // Ensure it returns an array
  } catch (error) {
    let errorMessage = "Sorry, something happened!";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    showToast({ message: errorMessage, title: "Error", type: "error" });
    throw new Error(errorMessage); // Ensure React Query correctly marks the error
  }
};

export const useFetchedFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice before showing an error
  });
};
