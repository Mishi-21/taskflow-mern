import React, { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { taskService } from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    search: "",
    sortBy: "newest",
  });

  // ── Fetch all tasks ─────────────────────────────
  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await taskService.getAll(params);
      setTasks(res.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Create task ──────────────────────────────────
  const createTask = async (data) => {
    try {
      const res = await taskService.create(data);
      setTasks((prev) => [res.data.data, ...prev]);
      toast.success("Task created!");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  // ── Update task ──────────────────────────────────
  const updateTask = async (id, data) => {
    try {
      const res = await taskService.update(id, data);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.data : t))
      );
      toast.success("Task updated!");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  // ── Toggle complete ──────────────────────────────
  const toggleComplete = async (id) => {
    try {
      const res = await taskService.toggleComplete(id);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? res.data.data : t))
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── Delete task ──────────────────────────────────
  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        filters,
        setFilters,
        fetchTasks,
        createTask,
        updateTask,
        toggleComplete,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used inside TaskProvider");
  return ctx;
};
