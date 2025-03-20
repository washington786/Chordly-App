import { showToast } from "@utils/Toast";
import { isAxiosError } from "axios";
import { getClient } from "src/api/client";

interface historyProps {
  audio: string;
  progress: number;
  date: string;
}
export default function useHistory() {
  async function createHistory({ audio, date, progress }: historyProps) {
    const client = await getClient();
    try {
      await client.post("/history/", { audio, date, progress });
    } catch (error) {
      let errorMessage = "Sorry, something went wrong.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast({ message: errorMessage, title: "Error", type: "error" });
    }
  }

  async function deleteHistoryAudios() {
    try {
      const client = await getClient();
      await client.delete("/history?all=yes");
      showToast({
        message: "History Items removed successfully",
        title: "Success",
        type: "success",
      });
    } catch (error) {
      let errorMessage = "Sorry, something went wrong.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      showToast({ message: errorMessage, title: "Error", type: "error" });
    }
  }
  return { createHistory, deleteHistoryAudios };
}
