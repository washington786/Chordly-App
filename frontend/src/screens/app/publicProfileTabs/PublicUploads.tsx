import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchPublicProfileUploads } from "@hooks/publicProfile";
import { RouteProp, useRoute } from "@react-navigation/native";
import { publicProfilePropTypes } from "src/@types/AuthPropTypes";
import GlobalStyles from "@styles/GlobalStyles";
import { white } from "@styles/Colors";
import { showToast, ToastContainer } from "@components/index";
import ItemComponent from "@components/app/profile/ItemComponent";
import Toast from "react-native-toast-message";
import EmptyRecords from "@components/app/EmptyRecords";
import { Uploads } from "src/@types/Audios";
import Loader from "@components/Loader";

const PublicUploads = () => {
  const route = useRoute<RouteProp<publicProfilePropTypes>>();
  const { profileId } = route.params;
  const { data, error, isError, isLoading } = useFetchPublicProfileUploads(
    profileId as string
  );

  useEffect(() => {
    if (isError && error) {
      showToast({ message: error.message, title: "Error", type: "error" });
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        GlobalStyles.scroll,
        { backgroundColor: white[50] },
      ]}
    >
      <ToastContainer>
        <Toast />
      </ToastContainer>

      {data?.map((audio: Uploads) => {
        return (
          <ItemComponent
            key={audio.id}
            category={audio.about}
            title={audio.title}
            id={audio.id}
            poster={audio.poster}
          />
        );
      })}
      {!data?.length && <EmptyRecords />}
    </ScrollView>
  );
};

export default PublicUploads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
  },
});
