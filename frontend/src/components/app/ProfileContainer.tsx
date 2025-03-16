import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import { UserProfile } from "src/@types/auth";
import { Avatar, Text } from "react-native-paper";
import { cod_gray, GreenMain } from "@styles/Colors";
import Icons from "react-native-vector-icons/Octicons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { profilePropTypes } from "src/@types/AuthPropTypes";
interface profile {
  profile?: UserProfile | null;
}
const ProfileContainer: FC<profile> = ({ profile }) => {
  const { navigate } = useNavigation<NavigationProp<profilePropTypes>>();
  if (!profile) return null;

  return (
    <TouchableOpacity
      onPress={() => navigate("settings")}
      style={styles.container}
    >
      {profile.avatar ? (
        <Avatar.Image source={{ uri: profile.avatar.url }} size={50} />
      ) : (
        <Avatar.Icon icon={"microphone"} size={50} />
      )}
      <View>
        <Text variant="titleSmall">{profile.name.toUpperCase()}</Text>
        <Text variant="bodySmall">{profile.email}</Text>
        <View style={styles.wrap}>
          <Text variant="bodySmall" style={{ color: cod_gray[300] }}>
            {profile.followers.length}{" "}
            {profile.followers.length > 1 ? " Followers" : " Follower"}
          </Text>
          <Text variant="bodySmall" style={{ color: cod_gray[300] }}>
            {profile.followings.length}{" "}
            {profile.followings.length > 1 ? " Followings" : " Following"}
          </Text>
        </View>
      </View>
      <Icons
        name={profile.verified ? "verified" : "unverified"}
        size={20}
        color={!profile.verified ? "red" : "green"}
        style={{ position: "absolute", top: 10, right: 20 }}
      />
    </TouchableOpacity>
  );
};

export default ProfileContainer;

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
