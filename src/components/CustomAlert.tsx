import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

interface CustomAlertProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  message,
  visible,
  onClose,
  onConfirm,
  confirmText = "OK",
}) => {
  if (Platform.OS !== "web") return null; // ⚠️ Seulement pour le Web

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onConfirm && (
              <TouchableOpacity style={styles.button} onPress={onConfirm}>
                <Text style={styles.buttonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    width: 300,
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  message: {
    fontSize: 16,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: { flexDirection: "row", gap: 10 },
  button: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default CustomAlert;
