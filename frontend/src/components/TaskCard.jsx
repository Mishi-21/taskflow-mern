import React, { useState } from "react";
import { format } from "date-fns";
import { useTaskContext } from "../context/TaskContext";
import EditTaskModal from "./EditTaskModal";

const PRIORITY_COLORS = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };
const CATEGORY_ICONS = {
  Work: "💼", Personal: "👤", Shopping: "🛒",
  Health: "❤️", Finance: "💰", Other: "📌",
};

const TaskCard = ({ task }) => {
  const { toggleComplete, deleteTask } = useTaskContext();
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setDeleting(true);
    await deleteTask(task._id);
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <>
      <div className={`task-card ${task.completed ? "task-completed" : ""} ${deleting ? "deleting" : ""}`}>
        <div className="task-card-header">
          <button
            className={`complete-btn ${task.completed ? "active" : ""}`}
            onClick={() => toggleComplete(task._id)}
            title={task.completed ? "Mark as pending" : "Mark as complete"}
          >
            {task.completed ? "✓" : ""}
          </button>

          <div className="task-card-meta">
            <span className="category-badge">
              {CATEGORY_ICONS[task.category]} {task.category}
            </span>
            <span
              className="priority-badge"
              style={{ color: PRIORITY_COLORS[task.priority], borderColor: PRIORITY_COLORS[task.priority] }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <div className="task-card-body">
          <h3 className={`task-title ${task.completed ? "strikethrough" : ""}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>

        <div className="task-card-footer">
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
              📅 {isOverdue ? "⚠ Overdue · " : ""}{format(new Date(task.dueDate), "MMM d, yyyy")}
            </span>
          )}
          <span className="created-at">
            Created {format(new Date(task.createdAt), "MMM d")}
          </span>
          <div className="task-actions">
            <button className="btn-edit" onClick={() => setShowEdit(true)} title="Edit">✏️</button>
            <button className="btn-delete" onClick={handleDelete} title="Delete">🗑️</button>
          </div>
        </div>
      </div>

      {showEdit && <EditTaskModal task={task} onClose={() => setShowEdit(false)} />}
    </>
  );
};

export default TaskCard;
