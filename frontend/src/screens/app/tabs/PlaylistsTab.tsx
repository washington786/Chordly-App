import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchPlaylist } from "@hooks/query";
import { QueryClient } from "@tanstack/react-query";
import { showToast } from "@utils/Toast";
import Loader from "@components/Loader";
import GlobalStyles from "@styles/GlobalStyles";
import { white } from "@styles/Colors";
import ToastContainer from "@components/app/ToastContainer";
import Toast from "react-native-toast-message";
import EmptyRecords from "@components/app/EmptyRecords";
import ItemComponent from "@components/app/playlist/ItemComponent";
import { Playlist } from "src/@types/Audios";

const PlaylistsTab = () => {
  const queryClient = new QueryClient();

  const { data, error, isError, isLoading } = useFetchPlaylist(
    queryClient,
    showToast
  );

  useEffect(() => {
    if (isError && error) {
      showToast({ message: error.message, title: "Error", type: "error" });
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader />;
  }

  //   console.log("playlist: ",data);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        GlobalStyles.scroll,
        { backgroundColor: data?.length > 0 ? white[50] : white[100] },
      ]}
    >
      <ToastContainer>
        <Toast />
      </ToastContainer>

      {data?.map((audio: Playlist) => {
        return <ItemComponent key={audio.id} playlist={audio} />;
      })}
      {!data?.length && <EmptyRecords />}
    </ScrollView>
  );
};

export default PlaylistsTab;

const styles = StyleSheet.create({});
