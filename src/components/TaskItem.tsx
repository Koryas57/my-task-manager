import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Task } from "../types/Task";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onToggleComplete(task.id)}>
          <Text style={styles.buttonText}>{task.completed ? "✅" : "⬜"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)}>
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
    marginBottom: spacing.small,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  completed: {
    textDecorationLine: "line-through",
    color: colors.mutedText,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.small,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default TaskItem;
