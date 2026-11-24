const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getTasks, createTask, deleteTask, updateTask } = require("../controllers/taskController");

router.get("/tasks", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

module.exports = router;