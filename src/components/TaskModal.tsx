import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Task } from "../types/Task";
import { Ionicons } from "@expo/vector-icons";

interface TaskModalProps {
  visible: boolean;
  task: Task | null;
  onSave: (updatedTask: Partial<Task>) => void;
  onClose: () => void;
  onDelete: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  task,
  onSave,
  onClose,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setShowDeleteConfirm(false); // ✅ On revient toujours en mode édition au début
    }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Erreur : Le nom de la tâche ne peut pas être vide.");
      return;
    }
    onSave({ title, description }); // ✅ On envoie bien title + description
    onClose();
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (task) {
      onDelete(task.id);
      setShowDeleteConfirm(false); // ✅ Réinitialisation après suppression
      onClose(); // ✅ Fermer le modal après suppression
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {showDeleteConfirm ? (
            <>
              <Text style={styles.modalTitle}>Supprimer cette tâche ?</Text>
              <Text style={styles.warningText}>
                Cette action est irréversible.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.buttonText}>Oui, supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>
                {task ? "Modifier la tâche" : "Nouvelle tâche"}
              </Text>

              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nom de la tâche"
                placeholderTextColor="#aaa"
              />

              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                placeholderTextColor="#aaa"
                multiline
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.buttonText}>Enregistrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>

                {task && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={confirmDelete}
                  >
                    <Ionicons name="trash-outline" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  warningText: {
    color: "#ff4444",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#aaa",
    color: "#fff",
    paddingVertical: 8,
    marginBottom: 15,
  },
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#aaa",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default TaskModal;
