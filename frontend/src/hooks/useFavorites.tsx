import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import { getClient } from "src/api/client";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";

// ✅ Function to toggle favorite status
const toggleFavorite = async (id: string) => {
  try {
    const token = await fetchFromStorage(Keys.AUTH_TOKEN);
    if (!token) {
      showToast({
        message: "Authentication required",
        title: "Error",
        type: "error",
      });
      return;
    }

    const client = await getClient();
    const { data } = await client.post(
      `/favorites/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { id, status: data.status };
  } catch (error) {
    let errorMessage = "Sorry, something went wrong.";
    if (isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    showToast({ message: errorMessage, title: "Error", type: "error" });
    throw new Error(errorMessage); // Ensure error bubbles up
  }
};

// ✅ Hook to use toggle functionality
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      // Get current favorite list
      const previousFavorites = queryClient.getQueryData<any[]>(["favorites"]) || [];

      // Optimistically update UI
      queryClient.setQueryData(["favorites"], (oldFavorites: any[]) => {
        const exists = oldFavorites.some((fav) => fav.id === id);
        return exists
          ? oldFavorites.filter((fav) => fav.id !== id) // Remove if exists
          : [...oldFavorites, { id }]; // Add if not exists
      });

      return { previousFavorites };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(["favorites"], context?.previousFavorites); // Rollback on failure
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] }); // Refetch data
    },
  });
};
