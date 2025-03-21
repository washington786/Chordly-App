import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  DashboardTypes,
  publicProfilePropTypes,
} from "src/@types/AuthPropTypes";
import { useFetchPublicProfile } from "@hooks/publicProfile";
import { showToast } from "@utils/Toast";
import Loader from "@components/Loader";
import { cod_gray, GreenMain, white } from "@styles/Colors";
import { Avatar, Text } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import PublicUploads from "./publicProfileTabs/PublicUploads";
import PublicPlaylist from "./publicProfileTabs/PublicPlaylist";

interface publicProfileProps {
  profile: {
    avatar: string;
    followers: number;
    id: string;
    name: string;
  };
}

const Tabs = createMaterialTopTabNavigator<publicProfilePropTypes>();

const PublicProfile = () => {
  const route = useRoute<RouteProp<DashboardTypes>>();

  const { profileId } = route.params || {};

  const { data, isLoading, error, isError } = useFetchPublicProfile(
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

  const { profile } = data as publicProfileProps;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: white[50],
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <TouchableOpacity onPress={() => {}} style={styles.container}>
        {profile.avatar ? (
          <Avatar.Image source={{ uri: profile.avatar }} size={50} />
        ) : (
          <Avatar.Icon icon={"microphone"} size={50} />
        )}
        <View>
          <Text variant="titleSmall">{profile.name.toUpperCase()}</Text>

          <View style={styles.wrap}>
            <Text variant="bodySmall" style={{ color: cod_gray[300] }}>
              {profile.followers}{" "}
              {profile.followers > 1 ? " Followers" : " Follower"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Tabs.Navigator
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
        <Tabs.Screen
          name="publicUploads"
          component={PublicUploads}
          options={{ tabBarLabel: "Uploads" }}
          initialParams={{ profileId: profileId }}
        />
        <Tabs.Screen
          name="publicPlaylist"
          component={PublicPlaylist}
          options={{ tabBarLabel: "Playlist" }}
          initialParams={{ profileId: profileId }}
        />
      </Tabs.Navigator>
    </View>
  );
};

export default PublicProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "relative",
    backgroundColor: GreenMain[50],
    marginHorizontal: 12,
    marginVertical: 5,
  },
  wrap: {
    flexDirection: "row",
    gap: 12,
  },
});
