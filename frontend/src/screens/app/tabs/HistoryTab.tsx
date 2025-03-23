import { ScrollView, StyleSheet, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useFetchHistory } from "@hooks/historyQuery";
import { showToast } from "@utils/Toast";
import Loader from "@components/Loader";
import EmptyRecords from "@components/app/EmptyRecords";
import {
  Button,
  Dialog,
  Divider,
  PaperProvider,
  Portal,
  Text,
} from "react-native-paper";
import { GreenMain, red } from "@styles/Colors";

import Icons from "react-native-vector-icons/AntDesign";
import useHistory from "@hooks/useHistory";
import { ToastContainer } from "@components/index";
import Toast from "react-native-toast-message";

interface historyItem {
  id: string;
  audioId: string;
  date: string;
  title: string;
}

interface history {
  date?: string | undefined;
  audios: historyItem[];
}
interface historyDate {
  date: string | undefined;
}

const HistoryTab = () => {
  const [showDelete, setShowDelete] = useState(false);
  function handleDelete() {
    setShowDelete(!showDelete);
  }
  const { deleteHistoryAudios } = useHistory();
  const { data, error, isError, isLoading, refetchHistory } = useFetchHistory();
  useEffect(() => {
    if (error && isError) {
      showToast({ message: error.message, title: "Error", type: "error" });
    }
  }, [error, isError]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data.histories.length) {
    return <EmptyRecords />;
  }

  async function deleteAllHistory() {
    await deleteHistoryAudios();
    handleDelete();
    refetchHistory();
  }

  return (
    <PaperProvider>
      <ScrollView
        contentContainerStyle={{ backgroundColor: "white" }}
        style={{ flex: 1 }}
      >
        <ToastContainer>
          <Toast />
        </ToastContainer>
        {data.histories.map((item: history, index: string) => {
          return (
            <View style={styles.con} key={index + item.date}>
              <ItemDate date={item.date} />
              <ItemAudios audios={item.audios} />
            </View>
          );
        })}
        {data.histories.length && (
          <View style={{ marginVertical: 8, paddingHorizontal: 8 }}>
            <Button
              mode="elevated"
              uppercase
              style={{ backgroundColor: red[500] }}
              labelStyle={{ color: "white" }}
              icon={"delete-forever"}
              onPress={handleDelete}
            >
              remove all
            </Button>
          </View>
        )}
        <DeleteDialog
          visible={showDelete}
          handleCancel={handleDelete}
          onDismiss={handleDelete}
          handleRemove={deleteAllHistory}
        />
      </ScrollView>
    </PaperProvider>
  );
};

function ItemDate({ date }: historyDate) {
  return (
    <>
      <Text variant="bodyMedium">{date}</Text>
      <Divider />
    </>
  );
}

function ItemAudios({ audios }: history) {
  const { deleteHistoryItem } = useHistory();
  const { refetchHistory } = useFetchHistory();
  return (
    <>
      <View style={styles.audio}>
        {audios.map((audio: historyItem) => {
          return (
            <View key={audio.id} style={styles.innerWrap}>
              <Text variant="titleMedium">{audio.title}</Text>
              <Icons
                name="close"
                onPress={() => {
                  deleteHistoryItem(audio.id);
                  refetchHistory();
                }}
              />
            </View>
          );
        })}
      </View>
    </>
  );
}

interface dialogProps {
  visible: boolean;
  onDismiss(): void;
  handleRemove(): void;
  handleCancel(): void;
}
function DeleteDialog({
  visible,
  onDismiss,
  handleRemove,
  handleCancel,
}: dialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Confirm</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            Are you sure you want to remove all your history items?
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>Cancel</Button>
          <Button onPress={handleRemove}>Continue</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default HistoryTab;

const styles = StyleSheet.create({
  audio: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GreenMain[50],
    marginVertical: 8,
    // gap:10
  },
  con: {
    marginVertical: 7,
    paddingHorizontal: 6,
    gap: 4,
  },
  innerWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
});
