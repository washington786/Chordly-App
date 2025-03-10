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
import { categoryTypes, items } from "@utils/CategoryData";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import client from "src/api/client";
import { fetchFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import * as ImagePicker from "expo-image-picker";

const validationSchema = yup.object().shape({
  title: yup.string().trim().required("title is required!"),
  about: yup.string().trim().required("about field is required!"),
  category: yup.string().oneOf(categoryTypes, "category is required!"),
  file: yup.object().shape({
    uri: yup.string().required("audio file is required!"),
    mimeType: yup.string().required("audio file is required!"),
    name: yup.string().required("audio file is required!"),
    size: yup.string().required("audio file is required!"),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    type: yup.string(),
    name: yup.string(),
    size: yup.string(),
  }),
});

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
};

const Upload = () => {
  const [audioFile, setAudioFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);

  const [image, setImage] =
    useState<ImagePicker.ImagePickerSuccessResult | null>(null);

  const [category, setCategory] = useState<string>();

  const multiSelect = useRef<MultiSelect>(null);

  const [audioInfo, setAudioInfo] = useState({ ...defaultForm });

  function onSelect(category: string) {
    setCategory(category);
  }

  async function handleSubmit() {
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
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("about", about);
      formData.append("category", selectedCategory);
  
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
          type: poster.mimeType,
          uri: poster.uri,
        });
      }
  
      const token = await fetchFromStorage(Keys.AUTH_TOKEN);
      const client_res = await client.post("/audio/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });
  
      if (client_res.status === 200) {
        console.log("created",client_res.data);
      } else {
        console.log(client_res.data.message);
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log("Validation error: ", error.message);
      } else {
        console.log("Submission error: ", error);
      }
    }
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
    // <ScrollViewWrapper>
    <KeyboardAvoidanceView>
      {/* <Text variant="labelLarge">Upload Audio</Text> */}
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
        <View>{multiSelect.current?.getSelectedItemsExt(category)}</View>

        <Button
          mode="contained"
          uppercase
          buttonColor={GreenMain[500]}
          style={styles.btn}
          onPress={handleSubmit}
        >
          submit
        </Button>
      </View>
    </KeyboardAvoidanceView>
    // </ScrollViewWrapper>
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
