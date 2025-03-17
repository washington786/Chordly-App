import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UploadsTab from "./tabs/UploadsTab";
import PlaylistsTab from "./tabs/PlaylistsTab";
import FavoritesTab from "./tabs/FavoritesTab";
import HistoryTab from "./tabs/HistoryTab";
import { GreenMain, white } from "@styles/Colors";
import ProfileContainer from "@components/app/ProfileContainer";
import { useSelector } from "react-redux";
import { authState } from "src/store/auth";
import { UserProfile } from "src/@types/auth";

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  const { profile } = useSelector(authState);
  return (
    <View style={styles.container}>
      <ProfileContainer profile={profile as unknown as UserProfile} />
      <Tab.Navigator
        initialRouteName="uploads"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: white[50],
            elevation: 0,
            shadowRadius: 0,
            shadowColor: white[50],
          },
          tabBarIndicatorStyle: {
            backgroundColor: GreenMain[300],
            height: 3,
          },
        }}
      >
        <Tab.Screen name="uploads" component={UploadsTab} />
        <Tab.Screen name="playlist" component={PlaylistsTab} />
        <Tab.Screen name="favorites" component={FavoritesTab} />
        <Tab.Screen name="history" component={HistoryTab} />
      </Tab.Navigator>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white[50],
  },
});
