import React from "react";
import { FlatList } from "react-native";
import SwipeableTask from "./SwipeableTask";
import { Task } from "../types/Task";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onOpenPopup: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onEditTask,
  onOpenPopup,
}) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SwipeableTask
          task={item}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onOpenPopup={onOpenPopup}
        />
      )}
    />
  );
};

export default TaskList;
