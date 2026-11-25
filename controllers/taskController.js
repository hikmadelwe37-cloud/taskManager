const db = require("../config/db"); // adjust path if your db file is named differently

async function getTasks(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
}

async function createTask(req, res) {
  const { title } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const cleanTitle = String(title).trim();
    const [result] = await db.query(
      "INSERT INTO tasks (title, completed, status) VALUES (?, ?, ?)",
      [cleanTitle, 0, "Pending"]
    );

    res.status(201).json({
      id: result.insertId,
      title: cleanTitle,
      completed: 0,
      status: "Pending",
    });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ message: "Failed to save task to server" });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed, status } = req.body;

  let completedVal = null;
  let statusVal = null;

  if (status !== undefined) {
    statusVal = status;
    completedVal = status === "Completed" ? 1 : 0;
  } else if (completed !== undefined) {
    completedVal = completed ? 1 : 0;
    statusVal = completed ? "Completed" : "Pending";
  }

  const cleanTitle = title !== undefined ? String(title).trim() : null;

  try {
    const [result] = await db.query(
      `UPDATE tasks
       SET title = COALESCE(?, title),
           completed = COALESCE(?, completed),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [cleanTitle, completedVal, statusVal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      id: Number(id),
      ...(cleanTitle !== null && { title: cleanTitle }),
      ...(completedVal !== null && { completed: completedVal }),
      ...(statusVal !== null && { status: statusVal }),
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted", id: Number(id) });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};