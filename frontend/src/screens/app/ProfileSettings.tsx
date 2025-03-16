import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import AppHeader from "@components/app/AppHeader";
import { Avatar, Button, Text } from "react-native-paper";
import Input from "@components/auth/Input";
import { cod_gray, GreenMain, white } from "@styles/Colors";
import Icons from "react-native-vector-icons/Octicons";
const ProfileSettings = () => {
  return (
    <>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.con}
        showsVerticalScrollIndicator={false}
      >
        <View>
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
              <Avatar.Icon icon={"microphone"} size={60} />
              <Button mode="text">update profile image</Button>
            </View>
            <View>
              <Input placeholder={"john"} />
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Text style={{ color: "white" }}>john@gmail.com</Text>
                <Icons name="verified" size={18} color={"white"} />
              </View>
              <Button
                uppercase
                style={[styles.btn, { backgroundColor: "white" }]}
              >
                update
              </Button>
            </View>
          </View>
          <View>
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
            >
              logout
            </Button>
            <Button
              labelStyle={styles.lbl}
              icon={"location-exit"}
              mode="contained-tonal"
              style={styles.btn}
            >
              logout all
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
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
