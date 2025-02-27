import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

interface ProfileHeaderProps {
  user: any;
  onLogout: () => void; // 🔥 Récupère logout en prop
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onLogout }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState(user?.photoURL || "");

  useEffect(() => {
    if (user?.photoURL) {
      setProfileImageUri(user.photoURL);
    }
  }, [user]);

  return user ? (
    <View style={styles.profileContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            style={styles.profileImage}
          />
        ) : (
          <Image
            source={require("../../assets/g-logo.png")}
            style={styles.profileImage}
          />
        )}
      </TouchableOpacity>

      {/* 🔥 MODAL PROFIL 🔥 */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{
                uri: profileImageUri
                  ? profileImageUri
                  : "../../assets/g-logo.png",
              }}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{user.displayName}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>📋 Liste des tâches</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={onLogout}>
              <Text style={styles.modalButtonText}>🚪 Se déconnecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>❌ Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#bbb",
    fontSize: 14,
  },
});

export default ProfileHeader;
