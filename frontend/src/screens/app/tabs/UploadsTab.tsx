import { ScrollView, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchedUploadsByProfile } from "@hooks/profileQuery";
import Toast from "react-native-toast-message";
import { showToast } from "@utils/Toast";
import { Uploads } from "src/@types/Audios";
import Loader from "@components/Loader";
import GlobalStyles from "@styles/GlobalStyles";
import ItemComponent from "@components/app/profile/ItemComponent";
import EmptyRecords from "@components/app/EmptyRecords";
import { white } from "@styles/Colors";
import ToastContainer from "@components/app/ToastContainer";

const UploadsTab = () => {
  const { data, error, isError, isLoading } = useFetchedUploadsByProfile();

  useEffect(() => {
    if (isError && error) {
      showToast({
        message: error?.message ?? "Sorry, something happened.",
        title: "Error",
        type: "error",
      });
    }
  }, [isError, error]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        GlobalStyles.scroll,
        { backgroundColor: data?.audios.length > 0 ? white[100] : white[50] },
      ]}
    >
      <ToastContainer>
        <Toast />
      </ToastContainer>

      {data?.audios?.map((audio: Uploads) => {
        return (
          <ItemComponent
            key={audio.id}
            category={audio.category}
            title={audio.title}
            id={audio.id}
            poster={audio.poster}
          />
        );
      })}
      {!data?.audios.length && <EmptyRecords />}
    </ScrollView>
  );
};

export default UploadsTab;
