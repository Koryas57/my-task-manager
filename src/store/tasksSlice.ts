import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../types/Task";
import { listenToTasks } from "../services/taskService";
import { AppDispatch } from "../store";

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload.map((task) => ({
        ...task,
        createdAt:
          typeof task.createdAt === "string"
            ? new Date(task.createdAt)
            : task.createdAt,
        updatedAt:
          typeof task.updatedAt === "string"
            ? new Date(task.updatedAt)
            : task.updatedAt,
      }));
    },
  },
});

export const { setTasks } = tasksSlice.actions;

// ✅ Fonction pour écouter Firebase et synchroniser Redux
export const startListeningToTasks =
  (uid: string) => (dispatch: AppDispatch) => {
    return listenToTasks(uid, (tasks) => {
      dispatch(setTasks(tasks));
    });
  };

export default tasksSlice.reducer;
