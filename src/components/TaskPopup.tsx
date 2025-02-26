import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { Task } from "../types/Task";

interface TaskPopupProps {
  task: Task;
  onClose: () => void;
  onOpenModal: () => void;
  onUpdate: (title: string) => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({
  task,
  onClose,
  onOpenModal,
  onUpdate,
}) => {
  const [editedTitle, setEditedTitle] = React.useState(task.title);

  return (
    <View style={styles.popup}>
      <TextInput
        value={editedTitle}
        onChangeText={setEditedTitle}
        style={styles.input}
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => onUpdate(editedTitle)}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenModal}>
          <Ionicons name="expand" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  popup: {
    position: "absolute",
    bottom: 100,
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    color: colors.text,
    padding: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});

export default TaskPopup;
