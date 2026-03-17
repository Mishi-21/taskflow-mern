import React, { useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Other"];
const PRIORITIES = ["Low", "Medium", "High"];

const TaskForm = ({ onClose }) => {
  const { createTask } = useTaskContext();
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "Other",
    priority: "Medium",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
    };
    const success = await createTask(payload);
    setSubmitting(false);
    if (success) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Task Title <span className="required">*</span></label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className={error ? "input-error" : ""}
        />
        {error && <span className="error-msg">{error}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details (optional)..."
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
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
        <button type="button" className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating…" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;