const db = require('../config/db');

// GET /api/tasks - Retrieve all tasks
const getAllTasks = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tasks');
    res.json(results);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /api/tasks - Create a new task
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }
    const [result] = await db.query('INSERT INTO tasks (title) VALUES (?)', [title]);
    res.json({ id: result.insertId, title, completed: false });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/tasks/:id - Update task status
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['Pending', 'In Progress', 'Completed'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid task status' });
    }

    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/tasks/:id - Remove a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};