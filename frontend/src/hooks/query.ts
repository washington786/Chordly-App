import { useQuery } from "@tanstack/react-query";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import { isAxiosError } from "axios";
import client from "src/api/client";

export async function fetchLatest(queryClient: any, showToast: any) {
  try {
    const { data } = await client.get("/audio/latest");

    if (data) {
      queryClient.setQueryData(["home"], data);
      return data;
    }
    return;
  } catch (error) {
    if (isAxiosError(error)) {
      showToast({
        type: "error",
        message: error.response?.data.message || "An error occurred",
        title: "Error",
      });
    }
    showToast({ type: "error", message: error as string, title: "Error" });
  }
}
export async function fetchRecommended(queryClient: any, showToast: any) {
  try {
    const { data } = await client.get("/profile/recommended");

    if (data) {
      queryClient.setQueryData(["rec"], data);
      return data;
    }
    return;
  } catch (error) {
    if (isAxiosError(error)) {
      showToast({
        type: "error",
        message: error.response?.data.message || "An error occurred",
        title: "Error",
      });
    }
    showToast({ type: "error", message: error as string, title: "Error" });
  }
}
export async function fetchPlaylistByProfile(queryClient: any, showToast: any) {
  try {
    const { data } = await client.get("/playlist/by-profile", {
      headers: {
        Authorization: "Bearer " + (await fetchFromStorage(Keys.AUTH_TOKEN)),
      },
    });

    // console.log("API Response:", data); // ✅ Debugging: See if data exists

    if (data) {
      queryClient.setQueryData(["playlist"], data);
      return data; // ✅ Make sure to return data!
    }
    return []; // ✅ Always return an empty array instead of undefined
  } catch (error) {
    console.log("Fetch Error:", error); // ✅ Debugging error

    if (isAxiosError(error)) {
      showToast({
        type: "error",
        message: error.response?.data.message || "An error occurred",
        title: "Error",
      });
    }
    showToast({ type: "error", message: error as string, title: "Error" });
    return []; // ✅ Return empty array to prevent `undefined`
  }
}

export function useFetchPlaylist(queryClient: any, showToast: any) {
  return useQuery({
    queryKey: ["playlist"],
    queryFn: () => fetchPlaylistByProfile(queryClient, showToast),
  });
}
