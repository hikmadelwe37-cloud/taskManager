async function updateTask(req, res) {
  const { id } = req.params;
  const { title, completed } = req.body;

  // Keep both `completed` (0/1) and `status` ('Pending'/'Completed') aligned
  const completedVal = completed !== undefined ? (completed ? 1 : 0) : null;
  const statusVal = completed !== undefined ? (completed ? "Completed" : "Pending") : null;

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
      ...(completed !== undefined && { completed: completedVal, status: statusVal }),
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
}