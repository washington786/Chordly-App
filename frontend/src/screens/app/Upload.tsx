import { StyleSheet, View } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import UploadFiles from "@components/app/UploadFiles";
import UploadAudio from "@components/app/UploadAudio";
import * as DocumentPicker from "expo-document-picker";
import Input from "@components/auth/Input";
import { cod_gray, GreenMain } from "@styles/Colors";
import KeyboardAvoidanceView from "@components/KeyboardAvoidanceView";
import { Button } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { items } from "@utils/CategoryData";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import client from "src/api/client";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import * as ImagePicker from "expo-image-picker";

import { validationSchema } from "@utils/uploadValidationSchema";

import * as Progress from "react-native-progress";
import Toast from "react-native-toast-message";

interface FormFields {
  title: string;
  about: string;
  category: string;
  file?: DocumentPicker.DocumentPickerSuccessResult;
  poster?: ImagePicker.ImagePickerSuccessResult;
}

const defaultForm: FormFields = {
  title: "",
  about: "",
  category: "",
  file: undefined,
  poster: undefined,
};

const Upload = () => {
  // const;
  const [audioFile, setAudioFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);

  const [image, setImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);

  const [category, setCategory] = useState<string[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);

  const multiSelect = useRef<MultiSelect>(null);

  const [audioInfo, setAudioInfo] = useState({ ...defaultForm });

  function onSelect(category: string[]) {
    setCategory(category);
  }

  const showToast = ({
    type,
    message,
    title,
  }: {
    type: "success" | "error";
    message: string;
    title: string;
  }) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      autoHide: true,
      swipeable: true,
      visibilityTime: 5000,
      position: "top",
      topOffset: 0,
    });
  };

  function resetForm() {
    setAudioInfo({
      about: "",
      title: "",
      file: undefined,
      poster: undefined,
      category: "",
    });
    setCategory([]);
    setImage(null);
    setAudioFile(null);
    setUploadProgress(0);
    setBusy(false);
  }

  async function handleSubmit() {
    setBusy(true);
    let filteredCat = items
      .filter((item) => item.id === category?.at(0))
      .map((item) => item.name)
      .join(",");

    // Ensure values are correctly structured for validation
    const updatedAudioInfo = {
      ...audioInfo,
      category: filteredCat,
      file: audioFile && !audioFile.canceled ? audioFile : undefined,
      poster: image && !image.canceled ? image : undefined,
    };

    try {
      const res = await validationSchema.validate(updatedAudioInfo);
      const { about, file, poster, title, category: selectedCategory } = res;

      if (!file) {
        showToast({
          type: "error",
          message: "Please select an audio file",
          title: "Error",
        });
      } else if (!selectedCategory) {
        showToast({
          type: "error",
          message: "Please select a category",
          title: "Error",
        });
      } else if (!title) {
        showToast({
          type: "error",
          message: "Please enter a title",
          title: "Error",
        });
      } else if (!about) {
        showToast({
          type: "error",
          message: "Please enter a description",
          title: "Error",
        });
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("about", about);
      formData.append("category", selectedCategory as string);

      if (file) {
        formData.append("file", {
          name: file.name,
          type: file.mimeType,
          uri: file.uri,
        });
      }

      if (poster && poster.uri) {
        formData.append("poster", {
          name: poster.name,
          type: poster.type,
          uri: poster.uri,
        });
      }

      const token = await fetchFromStorage(Keys.AUTH_TOKEN);
      const client_res = await client.post("/audio/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const uploaded = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );

            console.log(`Upload Progress: ${uploaded}%`); // Debugging

            setUploadProgress(uploaded);

            if (uploaded >= 100) {
              setTimeout(() => {
                setAudioInfo({
                  ...defaultForm,
                  file: undefined,
                  poster: undefined,
                  category: "",
                });
                setBusy(false);
                setUploadProgress(0);
              }, 500); // Small delay to smooth progress bar reset
            }
          }
        },
      });

      if (client_res.status === 201) {
        resetForm();
        // console.log("created", client_res.data);
        showToast({
          type: "success",
          message: "Audio uploaded successfully",
          title: "Success",
        });
      } else {
        resetForm();
        console.log(client_res.data.message);
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log("Validation error: ", error.message);
        showToast({ type: "error", message: error.message, title: "Error" });
      } else {
        console.log("Submission error: ", error);
        showToast({ type: "error", message: error as string, title: "Error" });
      }
    }
    setBusy(false);
  }

  const navigation = useNavigation<NavigationProp<any>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Upload Audio",
      headerStyle: { backgroundColor: GreenMain[600] },
      headerTintColor: "#fff",
      headerShown: true,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidanceView>
      <View style={{ flexDirection: "row", paddingHorizontal: 8 }}>
        <UploadFiles image={image} setImage={setImage} />
        <UploadAudio audioFile={audioFile} setAudioFile={setAudioFile} />
      </View>

      <View style={styles.inputCons}>
        <Input
          placeholder="Title"
          mode="outlined"
          keyboardType="default"
          style={styles.input}
          placeholderTextColor={cod_gray[700]}
          textColor="#000"
          value={audioInfo.title}
          onChangeText={(title) => setAudioInfo({ ...audioInfo, title: title })}
        />
        <Input
          placeholder="About"
          mode="outlined"
          keyboardType="default"
          multiline={true}
          numberOfLines={5}
          style={[styles.input]}
          placeholderTextColor={cod_gray[700]}
          textColor="#000"
          value={audioInfo.about}
          onChangeText={(about) => setAudioInfo({ ...audioInfo, about: about })}
        />

        <MultiSelect
          hideTags
          items={items}
          uniqueKey="id"
          ref={multiSelect}
          onSelectedItemsChange={onSelect}
          onChangeInput={(cat) => setAudioInfo({ ...audioInfo, category: cat })}
          selectedItems={category}
          selectText="Select Category"
          searchInputPlaceholderText="Search Category..."
          tagRemoveIconColor="#666"
          tagBorderColor="#666"
          tagTextColor="#333"
          selectedItemTextColor={GreenMain[500]}
          selectedItemIconColor={GreenMain[500]}
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#000" }}
          submitButtonColor={GreenMain[500]}
          submitButtonText="Confirm"
          single={true}
        />
        <View>{multiSelect.current?.getSelectedItemsExt(category as any)}</View>

        {/* <ProgressBarComponent progress={uploadProgress} visible={!!busy} /> */}
        {!!busy && (
          <View style={{ marginVertical: 8 }}>
            <Progress.Bar
              progress={uploadProgress / 100}
              width={380}
              color={GreenMain[400]}
              animated
            />
          </View>
        )}
        <Button
          mode="contained"
          uppercase
          buttonColor={GreenMain[500]}
          style={styles.btn}
          onPress={handleSubmit}
          disabled={!!busy}
          loading={!!busy}
        >
          {busy ? "Uploading..." : "Submit"}
        </Button>
        <Toast />
      </View>
    </KeyboardAvoidanceView>
  );
};

export default Upload;

const styles = StyleSheet.create({
  inputCons: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: GreenMain[600],
    marginVertical: 5,
  },
  btn: {
    borderRadius: 0,
    marginTop: 8,
    paddingVertical: 5,
  },
});
