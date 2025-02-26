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
    title: data.title || "",
    description: data.description || "", // ✅ Correction : On récupère la description
    completed: data.completed || false,
    createdAt: data.createdAt
      ? data.createdAt.toDate
        ? data.createdAt.toDate().toISOString()
        : data.createdAt
      : new Date().toISOString(),
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
    const tasks = snapshot.docs.map(convertTask); // ✅ Appel de `convertTask`
    console.log("📡 Tâches récupérées depuis Firestore :", tasks); // 🔥 DEBUG
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

export const updateTask = async (
  taskId: string,
  updatedData: Partial<Task>
) => {
  if (!taskId) return;
  try {
    console.log("📝 Mise à jour de Firestore pour :", taskId, updatedData); // ✅ DEBUG

    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      ...updatedData,
      updatedAt: new Date().toISOString(), // 🔥 S'assurer que la date est bien formatée
    });

    console.log("✅ Tâche mise à jour dans Firestore !");
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de Firestore :", error);
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    console.log("🔥 Tentative de suppression Firestore de la tâche :", taskId);
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
    console.log("✅ Tâche supprimée dans Firestore !");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression :", error);
  }
};
