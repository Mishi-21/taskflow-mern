const Task = require("../models/Task");
const { validationResult } = require("express-validator");

// ─────────────────────────────────────────────
// @desc    Get all tasks (with filter + search)
// @route   GET /api/tasks
// @access  Public
// ─────────────────────────────────────────────
const getTasks = async (req, res) => {
  try {
    const { status, category, priority, search, sortBy } = req.query;

    // Build dynamic query object
    const query = {};

    if (status === "completed") query.completed = true;
    if (status === "pending") query.completed = false;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Text search on title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      dueDate: { dueDate: 1 },
      priority: { priority: -1 },
    };
    const sort = sortOptions[sortBy] || { createdAt: -1 };

    const tasks = await Task.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Public
// ─────────────────────────────────────────────
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
// ─────────────────────────────────────────────
const createTask = async (req, res) => {
  // Validate incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { title, description, dueDate, category, priority } = req.body;

    const task = await Task.create({ title, description, dueDate, category, priority });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
// ─────────────────────────────────────────────
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const allowedFields = ["title", "description", "dueDate", "category", "priority"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
// @access  Public
// ─────────────────────────────────────────────
const toggleTaskComplete = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Business rule: prevent re-completing an already completed task (unless uncompleting)
    if (task.completed && req.body.completed === true) {
      return res.status(400).json({
        success: false,
        message: "Task is already marked as completed",
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? "completed" : "pending"}`,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
// ─────────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, toggleTaskComplete, deleteTask };
