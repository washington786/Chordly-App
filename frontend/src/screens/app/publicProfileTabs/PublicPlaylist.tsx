import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { publicProfilePropTypes } from "src/@types/AuthPropTypes";
import { useFetchPublicProfilePlaylist } from "@hooks/publicProfile";
import { showToast } from "@utils/Toast";
import Loader from "@components/Loader";
import GlobalStyles from "@styles/GlobalStyles";
import { white } from "@styles/Colors";
import { ToastContainer } from "@components/index";
import Toast from "react-native-toast-message";
import { Playlist } from "src/@types/Audios";
import ItemComponent from "@components/app/playlist/ItemComponent";
import EmptyRecords from "@components/app/EmptyRecords";

const PublicPlaylist = () => {
  const route = useRoute<RouteProp<publicProfilePropTypes>>();
  const { profileId } = route.params;
  const { data, error, isError, isLoading } = useFetchPublicProfilePlaylist();

  useEffect(() => {
    if (isError && error) {
      showToast({ message: error.message, title: "Error", type: "error" });
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader />;
  }

  console.log(data);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        GlobalStyles.scroll,
        { backgroundColor: white[50] },
      ]}
      style={{ flex:1,backgroundColor:"white" }}
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

export default PublicPlaylist;

const styles = StyleSheet.create({});
