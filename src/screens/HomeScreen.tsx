import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { spacing } from "../styles/spacing";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store";
import { setTasks, startListeningToTasks } from "../store/tasksSlice";
import { addTask, deleteTask } from "../services/taskService";

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [taskTitle, setTaskTitle] = useState("");

  // ✅ Écoute Firebase en temps réel
  useEffect(() => {
    const unsubscribe = startListeningToTasks()(dispatch);
    return () => unsubscribe(); // ✅ Désabonnement proprement
  }, []);

  // ✅ Ajouter une tâche avec un nom personnalisé
  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    await addTask({
      title: taskTitle,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setTaskTitle(""); // Réinitialise l'input
  };

  // ✅ Supprimer une tâche
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.duration(800)}
        style={styles.innerContainer}
      >
        <Text style={typography.title}>Gestionnaire de Tâches</Text>
        <Text style={typography.subtitle}>
          Organise tes projets comme un pro
        </Text>

        {/* ✅ Champ pour entrer le nom de la tâche */}
        <TextInput
          style={styles.input}
          placeholder="Nom de la tâche..."
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id} // ✅ Utilisation de l'ID Firebase
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

        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>+ Ajouter une tâche</Text>
        </TouchableOpacity>
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
  innerContainer: {
    alignItems: "center",
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
  button: {
    marginTop: spacing.large,
    backgroundColor: colors.primary,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.extraLarge,
    borderRadius: 10,
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonText: {
    ...typography.button,
    textAlign: "center",
  },
});

export default HomeScreen;
