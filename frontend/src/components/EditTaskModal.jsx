import React, { useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

const EditTaskModal = ({ task, onClose }) => {
  const { updateTask } = useTaskContext();
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    category: task.category || "Other",
    priority: task.priority || "Medium",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    const success = await updateTask(task._id, { ...form, dueDate: form.dueDate || null });
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Title <span className="required">*</span></label>
            <input name="title" value={form.title} onChange={handleChange} className={error ? "input-error" : ""} />
            {error && <span className="error-msg">{error}</span>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
