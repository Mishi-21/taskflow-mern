const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} = require("../controllers/taskController");

// ── Validation rules ──────────────────────────
const createValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
  body("category")
    .optional()
    .isIn(["Work", "Personal", "Shopping", "Health", "Finance", "Other"])
    .withMessage("Invalid category"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),
];

const updateValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("dueDate")
    .optional({ nullable: true })
    .isISO8601().withMessage("Invalid date format"),
  body("category")
    .optional()
    .isIn(["Work", "Personal", "Shopping", "Health", "Finance", "Other"])
    .withMessage("Invalid category"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),
];

// ── Routes ─────────────────────────────────────
router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createValidation, createTask);
router.put("/:id", updateValidation, updateTask);
router.patch("/:id/complete", toggleTaskComplete);
router.delete("/:id", deleteTask);

module.exports = router;
