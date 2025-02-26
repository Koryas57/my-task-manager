import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { addTask } from "../services/taskService";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface TaskInputProps {
  onAddTask: (taskTitle: string) => Promise<void>;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const user = useSelector((state: RootState) => state.user.user);

  const handleAddTask = async () => {
    if (!taskTitle.trim() || !user) return; // ✅ Vérification correcte
    await addTask(
      {
        title: taskTitle,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user.uid
    );
    setTaskTitle(""); // ✅ Reset du champ après ajout
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nom de la tâche..."
        value={taskTitle}
        onChangeText={setTaskTitle}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onAddTask(taskTitle)}
      >
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.small,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.small,
    color: colors.text,
  },
  addButton: {
    padding: spacing.small,
  },
  validate: {
    color: colors.success,
  },
});

export default TaskInput;
