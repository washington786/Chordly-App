import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppHeader from "@components/app/AppHeader";
import { Avatar, Button, Text } from "react-native-paper";
import Input from "@components/auth/Input";
import { cod_gray, GreenMain, white } from "@styles/Colors";
import Icons from "react-native-vector-icons/Octicons";
import { getClient } from "src/api/client";
import { showToast } from "@utils/Toast";
// import ToastContainer from "@components/app/ToastContainer";
import Toast from "react-native-toast-message";
import { isAxiosError } from "axios";
import { removeFromStorage } from "@utils/AsyncStorage";
import { Keys } from "@utils/enums";
import { useDispatch, useSelector } from "react-redux";
import {
  authState,
  updateBusy,
  updateLoggedIn,
  updateProfile,
} from "src/store/auth";
import ToastContainer from "@components/app/ToastContainer";
import { UserProfiles } from "src/@types/auth";
import * as ImagePicker from "expo-image-picker";
import deepEqual from "deep-equal";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(authState);
  const { name, email, verified, avatar } = profile as unknown as UserProfiles;

  const [userName, setName] = useState<string | undefined>(name || undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: {
      profile_id: "",
      url: "",
    },
  });

  // const isSame = deepEqual(userInfo, {
  //   name: profile?.name,
  //   avatar: profile?.avatar,
  // });

  async function logout(fromAll?: boolean) {
    dispatch(updateBusy(true));
    try {
      const endPoint: string = "/auth/logout?fromAll=" + (fromAll ? "yes" : "");
      const client = await getClient();
      const res = await client.post(endPoint);
      if (res.status === 200) {
        await removeFromStorage(Keys.AUTH_TOKEN);
        dispatch(updateProfile(null));
        dispatch(updateLoggedIn(false));
        setTimeout(() => {
          showToast({
            message: "logout successful",
            title: "Success",
            type: "success",
          });
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "Sorry, something went wrong";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      showToast({ message: errorMessage, title: "Error", type: "error" });
    } finally {
      dispatch(updateBusy(false));
    }
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  function handleLogoutFromAll() {
    logout(true);
  }

  function handleLogoutFromOne() {
    logout();
  }

  useEffect(() => {
    if (profile) {
      setUserInfo({ name: profile.name, avatar: profile.avatar });
    }
  }, [profile]);

  async function updateUserProfile() {
    try {
      const form = new FormData();

      // Validate username
      if (!userName?.trim()) {
        return showToast({
          message: "Invalid username!",
          title: "Error",
          type: "error",
        });
      }

      // Append username to the form
      form.append("name", userName);

      // Append the selected image if it exists
      if (selectedImage) {
        const imageUriParts = selectedImage.split(".");
        const imageExtension = imageUriParts[imageUriParts.length - 1];

        const imageFile = {
          uri: selectedImage,
          name: `profile_image.${imageExtension}`,
          type: `image/${imageExtension}`,
        };

        form.append("attachment", imageFile as any);
      }

      // Create a client with the correct headers
      const client = await getClient({
        "Content-Type": "multipart/form-data",
      });

      // Make the API request
      const { data } = await client.post("/auth/update-profile", form);

      // Update the profile in the Redux store
      dispatch(updateProfile(data.profile));

      // Show success toast
      showToast({
        message: "Profile successfully updated",
        title: "Success",
        type: "success",
      });

      // Reset the selected image state if needed
      setSelectedImage(undefined);
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

  return (
    <View style={{ flex: 1 }}>
      <AppHeader />

      <ToastContainer>
        <Toast />
      </ToastContainer>

      <ScrollView
        contentContainerStyle={styles.con}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <View pointerEvents="box-none">
          <View
            style={{
              backgroundColor: GreenMain[300],
              paddingHorizontal: 8,
              marginVertical: 8,
              paddingVertical: 6,
            }}
          >
            <Text
              variant="titleMedium"
              style={{ color: white[50], fontWeight: "200" }}
            >
              Account Profile Settings
            </Text>
            <View style={styles.acc}>
              {!avatar?.url && !selectedImage && (
                <Avatar.Icon icon={"microphone"} size={60} />
              )}
              {avatar?.url && !selectedImage && (
                <Avatar.Image source={{ uri: avatar.url }} />
              )}
              {selectedImage && (
                <Avatar.Image source={{ uri: selectedImage }} />
              )}

              <Button mode="text" onPress={pickImageAsync}>
                update profile image
              </Button>
            </View>
            <View>
              <Input
                placeholder={name}
                autoCapitalize="none"
                autoCorrect={false}
                value={userName}
                onChangeText={(val) => setName(val)}
              />
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Text style={{ color: "white" }}>{email}</Text>
                <Icons
                  name={verified ? "verified" : "unverified"}
                  size={18}
                  color={"white"}
                />
              </View>

              <Button
                uppercase
                style={[styles.btn, { backgroundColor: "white" }]}
                onPress={updateUserProfile}
              >
                update
              </Button>
            </View>
          </View>
          <View style={{ flex: 1 }} pointerEvents="box-none">
            <Text
              variant="labelSmall"
              style={{
                color: cod_gray[400],
                fontWeight: "200",
                marginVertical: 8,
              }}
            >
              sign out
            </Text>
            <Button
              labelStyle={styles.lbl}
              icon={"exit-to-app"}
              mode="contained-tonal"
              style={styles.btn}
              onPress={handleLogoutFromOne}
              // disabled={busy}
              // loading={busy}
            >
              logout
            </Button>
            <Button
              // disabled={busy}
              // loading={busy}
              labelStyle={styles.lbl}
              icon={"location-exit"}
              mode="contained-tonal"
              style={styles.btn}
              onPress={handleLogoutFromAll}
            >
              logout all
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  con: {
    paddingHorizontal: 8,
  },
  btn: {
    marginVertical: 5,
    borderRadius: 0,
    backgroundColor: "red",
  },
  lbl: {
    color: "white",
  },
  acc: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    marginVertical: 8,
  },
});
