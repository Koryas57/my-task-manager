import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../styles/colors";
import { typography } from "../styles/typography";
import { spacing } from "../styles/spacing";
import { getTasks, addTask, deleteTask } from "../services/taskService";
import { Task } from "../types/Task";

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const newTask: Task = {
      id: new Date().toISOString(),
      title: "Nouvelle tâche",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await addTask(newTask);
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
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
