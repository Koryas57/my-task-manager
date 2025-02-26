import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { logoutUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";

const ProfileMenu: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // ✅ Correction du dispatch
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Text style={styles.menuToggle}>☰</Text>
      </TouchableOpacity>
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setMenuVisible(false)}>
            <Text style={styles.menuItem}>Liste de tâches</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.menuItem}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuToggle: {
    fontSize: 20,
    color: "white",
    padding: 5,
  },
  menu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#33333325",
    padding: 60,
    borderRadius: 5,
    zIndex: 10,
  },
  menuItem: {
    color: "white",
    paddingVertical: 5,
  },
});

export default ProfileMenu;
