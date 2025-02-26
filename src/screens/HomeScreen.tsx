import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { startListeningToTasks, setTasks } from "../store/tasksSlice";
import { loginUser, setUser } from "../store/userSlice";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { addTask, deleteTask, updateTask } from "../services/taskService";
import TaskList from "../components/TaskList";
import ProfileHeader from "../components/ProfileHeader";
import TaskInput from "../components/TaskInput";
import TaskModal from "../components/TaskModal";
import { Task } from "../types/Task";

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const user = useSelector((state: RootState) => state.user.user);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleClientIdWeb,
    androidClientId: Constants.expoConfig?.extra?.googleClientIdAndroid,
    redirectUri: AuthSession.makeRedirectUri({ scheme: "mytaskmanager" }),
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    if (!user) return;
    const unsubscribe = startListeningToTasks(user.uid)(dispatch);
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      getUserInfo(response.authentication.accessToken).then((userInfo) => {
        if (userInfo) {
          dispatch(
            setUser({
              uid: userInfo.sub,
              email: userInfo.email,
              displayName: userInfo.name,
              photoURL: userInfo.picture,
            })
          );
        }
      });
    }
  }, [response]);

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
      console.error("Erreur récupération utilisateur", error);
      return null;
    }
  };

  const handleOpenPopup = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleAddTask = async (taskTitle: string) => {
    if (!taskTitle.trim() || !user) return;
    const newTaskId = await addTask(
      {
        title: taskTitle,
        description: "",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user.uid
    );

    if (newTaskId) {
      dispatch(
        setTasks([
          ...tasks,
          {
            id: newTaskId,
            title: taskTitle,
            description: "",
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ])
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user) return;
    console.log("🔴 handleDeleteTask appelé avec :", taskId); // ✅ TEST
    await deleteTask(taskId);
    console.log("🗑 Tâche supprimée avec succès !");
    dispatch(setTasks(tasks.filter((task) => task.id !== taskId)));
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleSaveTask = async (updatedTask: Partial<Task>) => {
    if (!selectedTask || !user) return;

    console.log("📡 Envoi à Firebase :", updatedTask); // ✅ DEBUG
    await updateTask(selectedTask.id, updatedTask);

    console.log("🗄 Mise à jour de Redux :", updatedTask); // ✅ DEBUG
    dispatch(
      setTasks(
        tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...updatedTask } : task
        )
      )
    );

    setIsModalVisible(false);
    setSelectedTask(null);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader user={user} />
      <Text style={styles.title}>Gestionnaire de Tâches</Text>
      {user && <TaskInput onAddTask={handleAddTask} />}

      {user && tasks.length > 0 ? (
        <TaskList
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onOpenPopup={handleOpenPopup}
        />
      ) : (
        <Text style={styles.infoText}>
          {user
            ? "Aucune tâche pour le moment"
            : "Connectez-vous pour gérer vos tâches"}
        </Text>
      )}
      {!user && (
        <TouchableOpacity
          style={styles.authButton}
          onPress={async () => {
            const result = await promptAsync();
            if (result.type === "success" && result.authentication?.idToken) {
              dispatch(loginUser(result.authentication.idToken));
            } else {
              console.error("❌ Échec de l'authentification Google !");
            }
          }}
        >
          <Image
            source={require("../../assets/g-logo.png")}
            style={styles.googleIcon}
          />
          <Text style={styles.authButtonText}>Se connecter avec Google</Text>
        </TouchableOpacity>
      )}

      <TaskModal
        visible={isModalVisible}
        task={selectedTask}
        onSave={handleSaveTask}
        onClose={() => setIsModalVisible(false)}
        onDelete={handleDeleteTask} // ✅ Ajout de la suppression
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", margin: 60 },
  infoText: { color: "#aaa", textAlign: "center", marginTop: 20 },
  authButton: {
    flexDirection: "row",
    backgroundColor: "#4285F4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  authButtonText: { color: "white", fontSize: 16, marginLeft: 10 },
  googleIcon: { width: 24, height: 24 },
});

export default HomeScreen;
