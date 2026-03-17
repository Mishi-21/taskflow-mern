import React, { useEffect, useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";

const Dashboard = () => {
  const { tasks, loading, fetchTasks } = useTaskContext();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">✦ TaskFlow</div>
          <p className="header-sub">Stay organized. Get things done.</p>
        </div>
        <button className="btn-primary btn-new" onClick={() => setShowForm(true)}>
          + New Task
        </button>
      </header>

      {/* ── Stats Row ── */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-num">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-done">
          <span className="stat-num">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card stat-rate">
          <span className="stat-num">{completionRate}%</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="stat-label">Completion Rate</span>
        </div>
      </div>

      {/* ── Create Form Panel ── */}
      {showForm && (
        <div className="form-panel">
          <h2>Create New Task</h2>
          <TaskForm onClose={() => setShowForm(false)} />
        </div>
      )}

      {/* ── Filters ── */}
      <FilterBar />

      {/* ── Task Grid ── */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading tasks…</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No tasks yet</h3>
          <p>Click <strong>+ New Task</strong> to get started.</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
