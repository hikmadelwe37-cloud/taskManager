async function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed, status } = req.body;

  // Support both `completed` boolean/0/1 and `status` ('Pending' / 'Completed')
  let completedVal = null;
  let statusVal = null;

  if (status !== undefined) {
    statusVal = status;
    completedVal = status === "Completed" ? 1 : 0;
  } else if (completed !== undefined) {
    completedVal = completed ? 1 : 0;
    statusVal = completed ? "Completed" : "Pending";
  }

  try {
    const [result] = await db.query(
      `UPDATE tasks
       SET title = COALESCE(?, title),
           completed = COALESCE(?, completed),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [title ?? null, completedVal, statusVal, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      id: Number(id),
      ...(title !== undefined && { title }),
      ...(completedVal !== null && { completed: completedVal }),
      ...(statusVal !== null && { status: statusVal }),
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
}

module.exports = {
  getTasks, // change to getAllTasks if your function is named getAllTasks
  createTask,
  updateTask,
  deleteTask,
};