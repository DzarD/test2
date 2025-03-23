import { useState, useEffect } from "react";
import {
  getTasks,
  insertTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  updateTags as dbUpdateTags,
  deleteCompletedTasks as dbDeleteCompletedTasks
} from "../database/db";
import { Task } from "../constants/types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setLoading(true);
    const storedTasks = getTasks();
    setTasks(storedTasks);
    setLoading(false);
  };

  const addTask = (tagId: number | null, name: string, description: string) => {
    const insertedId = insertTask(tagId, name, description);
    setTasks([
      ...tasks,
      { id: insertedId, tag_id: tagId, name, description } as Task,
    ]);
  };
  //Update a task, find the id, update in db, reload tasks
  const updateTask = (
    id: number,
    tagId: number | null,
    name: string,
    description: string,
    isTaskCompleted: any
  ) => {
    dbUpdateTask(id, tagId, name, description, isTaskCompleted);
    loadTasks();
  };
  //Update tags in flow sessions
  const updateTags = (id: number, tagId: number | null) => {
    dbUpdateTags(id, tagId);
  };
  // Delete a task=> finds the id, delete form db, reloads the tasks
  const deleteTask = (id: number) => {
    dbDeleteTask(id);
    loadTasks();
  };
  // Function to delete completed tasks
  const deleteCompletedTasks = async () => {
    dbDeleteCompletedTasks();
    loadTasks();
  };

  return {
    tasks,
    loading,
    loadTasks,
    addTask,
    updateTask,
    updateTags,
    deleteTask,
    deleteCompletedTasks,
  };
};
