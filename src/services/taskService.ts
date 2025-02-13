import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { Task } from "../types/Task";

const TASKS_COLLECTION = "tasks";

// Ajouter une tâche
export const addTask = async (task: Task) => {
  try {
    await addDoc(collection(db, TASKS_COLLECTION), task);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche :", error);
  }
};

// Mettre à jour une tâche
export const updateTask = async (
  taskId: string,
  updatedData: Partial<Task>
) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};

// Supprimer une tâche
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};

// Récupérer toutes les tâches
export const getTasks = async (): Promise<Task[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, TASKS_COLLECTION));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Task
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    return [];
  }
};
