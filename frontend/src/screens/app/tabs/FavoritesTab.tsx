import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useFetchedFavorites } from "@hooks/profileQuery";
import Loader from "@components/Loader";
import { showToast } from "@utils/Toast";
import GlobalStyles from "@styles/GlobalStyles";
import Toast from "react-native-toast-message";
import { Uploads } from "src/@types/Audios";
import ItemComponent from "@components/app/profile/ItemComponent";
import EmptyRecords from "@components/app/EmptyRecords";
import { white } from "@styles/Colors";
import ToastContainer from "@components/app/ToastContainer";

const FavoritesTab = () => {
  const { data = [], error, isError, isLoading } = useFetchedFavorites();

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
        { backgroundColor: data?.length > 0 ? white[50] : white[100] },
      ]}
    >
      <ToastContainer>
        <Toast />
      </ToastContainer>

      {data?.map((audio: Uploads) => {
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
      {!data?.length && <EmptyRecords />}
    </ScrollView>
  );
};

export default FavoritesTab;

const styles = StyleSheet.create({});
