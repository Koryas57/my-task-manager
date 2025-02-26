import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";

interface AuthButtonProps {
  user: any;
  promptAsync: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user, promptAsync }) => {
  return (
    <TouchableOpacity style={styles.authButton} onPress={promptAsync}>
      <Image
        source={require("../../assets/g-logo.png")}
        style={styles.googleIcon}
      />
      <Text style={styles.authButtonText}>
        {user
          ? `Déconnexion (${user.displayName})`
          : "Se connecter avec Google"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  authButton: {
    flexDirection: "row",
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  googleIcon: { width: 24, height: 24, marginRight: 10 },
  authButtonText: { color: "white", fontSize: 16, fontWeight: "500" },
});

export default AuthButton;
