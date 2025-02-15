import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { spacing } from "../styles/spacing";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setTasks, startListeningToTasks } from "../store/tasksSlice";
import { addTask, deleteTask } from "../services/taskService";
import { loginUser, logoutUser, setUser } from "../store/userSlice";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const user = useSelector((state: RootState) => state.user.user);
  console.log("Utilisateur connecté :", user);
  const [taskTitle, setTaskTitle] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  // Initialisation de la connexion Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleClientIdWeb,
    androidClientId: Constants.expoConfig?.extra?.googleClientIdAndroid,
    redirectUri: AuthSession.makeRedirectUri({ scheme: "mytaskmanager" }),
    scopes: ["openid", "profile", "email"], // ✅ Demande explicitement l'idToken
  });

  // Vérification de la réponse Google et connexion Firebase
  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      console.log("✅ Réponse OAuth :", response);

      const accessToken = response.authentication.accessToken;

      getUserInfo(accessToken).then((userInfo) => {
        if (userInfo) {
          console.log("✅ Infos utilisateur Google :", userInfo);
          dispatch(
            setUser({
              uid: userInfo.sub, // L'ID unique de Google
              email: userInfo.email,
              displayName: userInfo.name,
              photoURL: userInfo.picture, // Récupération de l'avatar Google
            })
          );
        } else {
          console.error("❌ Impossible de récupérer les infos utilisateur");
        }
      });
    } else {
      console.error("❌ Aucun token reçu !");
    }
  }, [response]);

  // Écoute des tâches en temps réel après connexion
  useEffect(() => {
    if (!user) return;
    const unsubscribe = startListeningToTasks(user.uid)(dispatch);
    return () => unsubscribe();
  }, [user]);

  // Ajouter une tâche
  const handleAddTask = async () => {
    if (!taskTitle.trim() || !user) return;
    await addTask(
      {
        title: taskTitle,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user.uid
    );
    setTaskTitle("");
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    await deleteTask(taskId);
  };

  const getUserInfo = async (accessToken: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return await response.json();
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des infos utilisateur",
        error
      );
      return null;
    }
  };

  console.log("Affichage du profil :", user);

  return (
    <View style={styles.container}>
      {/* ✅ Profil utilisateur et menu déroulant */}
      {user && (
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => setMenuVisible(!menuVisible)}
        >
          {user.photoURL && (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.profileText}>{user.displayName}</Text>
        </TouchableOpacity>
      )}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setMenuVisible(false)}>
            <Text style={styles.menuItem}>Liste de tâches</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(logoutUser())}>
            <Text style={styles.menuItem}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Bouton Connexion/Déconnexion */}
      <TouchableOpacity
        style={styles.authButton}
        onPress={async () => {
          if (user) {
            dispatch(logoutUser());
          } else {
            const result = await promptAsync(); // Lance la demande d'authentification

            console.log("📡 Résultat OAuth :", result); // 🔍 DEBUG

            if (result.type === "success" && result.authentication?.idToken) {
              console.log("🔑 ID Token reçu :", result.authentication.idToken); // 🔍 DEBUG
              dispatch(loginUser(result.authentication.idToken)); // Envoie le token
            } else {
              console.error("❌ Échec de l'authentification Google !");
            }
          }
        }}
      >
        <Text style={styles.authButtonText}>
          {user
            ? `Déconnexion (${user.displayName})`
            : "Se connecter avec Google"}
        </Text>
      </TouchableOpacity>

      {/* ✅ Contenu principal */}
      <Animated.View
        entering={FadeInUp.duration(800)}
        style={styles.innerContainer}
      >
        <Text style={typography.title}>Gestionnaire de Tâches</Text>
        <Text style={typography.subtitle}>
          Organise tes projets comme un pro
        </Text>

        {user && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom de la tâche..."
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddTask}>
              <Text style={styles.buttonText}>+ Ajouter une tâche</Text>
            </TouchableOpacity>
          </>
        )}

        {user ? (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Animated.View
                entering={FadeInUp.duration(600)}
                style={styles.taskItem}
              >
                <Text style={styles.taskText}>{item.title}</Text>
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        ) : (
          <Text style={styles.infoText}>
            Connectez-vous pour gérer vos tâches
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.large,
    justifyContent: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: spacing.medium,
    right: spacing.medium,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.small,
  },
  profileText: {
    color: colors.text,
    fontSize: 16,
  },
  menu: {
    position: "absolute",
    top: 60,
    right: spacing.medium,
    backgroundColor: colors.card,
    padding: spacing.medium,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  menuItem: {
    paddingVertical: spacing.small,
    color: colors.text,
  },
  authButton: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 10,
    marginBottom: spacing.medium,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoText: {
    color: colors.text,
    fontSize: 16,
    marginTop: spacing.large,
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: spacing.medium,
    borderWidth: 1,
    borderColor: colors.text,
    marginBottom: spacing.medium,
    borderRadius: 5,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.medium,
    backgroundColor: colors.card,
    marginVertical: spacing.small,
    borderRadius: 5,
  },
  taskText: {
    color: colors.text,
  },
  deleteButton: {
    color: "red",
    fontSize: 20,
  },
});

export default HomeScreen;
