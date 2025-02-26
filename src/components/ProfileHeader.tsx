import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProfileMenu from "./ProfileMenu";

interface ProfileHeaderProps {
  user: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return user ? (
    <View style={styles.profileContainer}>
      {user.photoURL && (
        <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
      )}
      <Text style={styles.profileText}>{user.displayName}</Text>
      <ProfileMenu />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 20,
    right: 20,
  },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  profileText: { color: "white", fontSize: 16 },
});

export default ProfileHeader;
