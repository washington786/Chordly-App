import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import { isAxiosError } from "axios";
import { getClient } from "src/api/client";

const fetchHistory = async () => {
  try {
    const client = await getClient();
    const { data } = await client.get("/history/");
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

export const useFetchHistory = () => {
  const queryClient = useQueryClient();

  const refetchHistory = () => {
    queryClient.invalidateQueries({ queryKey: ["history"] });
  };

  return {
    ...useQuery({
      queryKey: ["history"],
      queryFn: fetchHistory,
      staleTime: 1000 * 30,
      retry: 2,
      refetchInterval: 5000, // Auto-refetch every 20 seconds
      refetchOnWindowFocus: false, // Auto-refetch when user focuses window
      refetchOnReconnect: true, // Auto-refetch when internet reconnects
    }),
    refetchHistory,
  };
};
