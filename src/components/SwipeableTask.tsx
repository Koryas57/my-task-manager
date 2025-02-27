import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "../types/Task";
import CustomAlert from "./CustomAlert"; // ✅ Importation du Modal d'alerte

interface SwipeableTaskProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenPopup: (task: Task) => void;
}

const SwipeableTask: React.FC<SwipeableTaskProps> = ({
  task,
  onDeleteTask,
  onEditTask,
  onOpenPopup,
}) => {
  const swipeRef = useRef<Swipeable>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleDelete = () => {
    if (Platform.OS === "web") {
      setAlertVisible(true);
    } else {
      Alert.alert(
        "Supprimer la tâche",
        "Voulez-vous vraiment supprimer cette tâche ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            onPress: () => onDeleteTask(task.id),
            style: "destructive",
          },
        ]
      );
    }
  };

  return (
    <>
      <Swipeable
        ref={swipeRef}
        renderRightActions={() => (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
      >
        <TouchableOpacity
          onPress={() => onEditTask(task)}
          style={styles.taskItem}
        >
          <Text style={styles.taskText}>{task.title}</Text>
        </TouchableOpacity>
      </Swipeable>

      {/* ✅ Afficher le Modal d'alerte uniquement sur Web */}
      <CustomAlert
        title="Supprimer la tâche"
        message="Voulez-vous vraiment supprimer cette tâche ?"
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          onDeleteTask(task.id);
          setAlertVisible(false);
        }}
        confirmText="Supprimer"
      />
    </>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    padding: 15,
    backgroundColor: "#282828",
    marginVertical: 5,
    borderRadius: 5,
  },
  taskText: { color: "white" },
  actionButton: {
    alignItems: "center",
    width: 80,
    height: "83%",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    marginTop: 5,
  },
});

export default SwipeableTask;
