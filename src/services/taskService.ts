import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { Task } from "../types/Task";
import { query, where } from "firebase/firestore";

const TASKS_COLLECTION = "tasks";

// ✅ Fonction pour convertir un document Firebase en tâche sérialisée
const convertTask = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    completed: data.completed,
    createdAt: data.createdAt
      ? data.createdAt.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt
      : new Date().toISOString(), // ✅ Gère le cas undefined
    updatedAt: data.updatedAt
      ? data.updatedAt.toDate
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt
      : new Date().toISOString(),
  };
};

// ✅ Récupérer toutes les tâches en temps réel
export const listenToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(convertTask);
    callback(tasks);
  });
};

// ✅ Ajouter une tâche (avec dates en string)
export const addTask = async (task: Omit<Task, "id">, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      userId, // 🔥 Associe la tâche à l'utilisateur
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche :", error);
  }
};

// ✅ Mettre à jour une tâche (avec conversion des dates)
export const updateTask = async (
  taskId: string,
  updatedData: Partial<Task>
) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // 🔥 Toujours une string
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};

// ✅ Supprimer une tâche
export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};
