import React from "react";
import { useTaskContext } from "../context/TaskContext";

const FilterBar = () => {
  const { filters, setFilters, fetchTasks } = useTaskContext();

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchTasks(updated);
  };

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-chips">
        {["", "pending", "completed"].map((s) => (
          <button
            key={s || "all"}
            className={`chip ${filters.status === s ? "chip-active" : ""}`}
            onClick={() => handleChange("status", s)}
          >
            {s === "" ? "All" : s === "pending" ? "Pending" : "Completed"}
          </button>
        ))}
      </div>

      <select
        value={filters.category}
        onChange={(e) => handleChange("category", e.target.value)}
        className="filter-select"
      >
        <option value="">All Categories</option>
        {["Work", "Personal", "Shopping", "Health", "Finance", "Other"].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleChange("priority", e.target.value)}
        className="filter-select"
      >
        <option value="">All Priorities</option>
        {["High", "Medium", "Low"].map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => handleChange("sortBy", e.target.value)}
        className="filter-select"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="dueDate">By Due Date</option>
        <option value="priority">By Priority</option>
      </select>
    </div>
  );
};

export default FilterBar;
