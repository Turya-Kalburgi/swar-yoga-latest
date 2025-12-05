import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// ===== GET ALL TODOS FOR USER =====
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const todos = await Todo.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(todos || []);
  } catch (error) {
    console.error('❌ Error fetching todos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ===== GET TODOS BY DATE =====
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const todos = await Todo.find({
      userId,
      dueDate: date
    })
      .sort({ dueTime: 1 })
      .lean();
    
    res.json(todos || []);
  } catch (error) {
    console.error('❌ Error fetching todos by date:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ===== GET SINGLE TODO =====
router.get('/single/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).lean();
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    console.error('❌ Error fetching single todo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ===== CREATE NEW TODO =====
router.post('/', async (req, res) => {
  try {
    const { userId, title, description, dueDate, dueTime, priority, category, reminder, reminderTime, linkedTaskId, linkedTaskTitle, tags } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ error: 'userId and title are required' });
    }

    const newTodo = new Todo({
      userId,
      title,
      description: description || '',
      dueDate: dueDate || '',
      dueTime: dueTime || '',
      priority: priority || 'Medium',
      category: category || 'Personal',
      reminder: reminder || false,
      reminderTime: reminderTime || '',
      linkedTaskId: linkedTaskId || '',
      linkedTaskTitle: linkedTaskTitle || '',
      tags: tags || [],
      status: 'Pending',
      completed: false
    });

    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error creating todo:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// ===== UPDATE TODO =====
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent modifying userId
    delete updates.userId;

    // Auto-update completedAt if toggling completion
    if (updates.completed === true && !updates.completedAt) {
      updates.completedAt = new Date();
      updates.status = 'Completed';
    } else if (updates.completed === false) {
      updates.completedAt = null;
      updates.status = 'Pending';
    }

    const updated = await Todo.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating todo:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// ===== DELETE TODO =====
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', data: deleted });
  } catch (error) {
    console.error('❌ Error deleting todo:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ===== BULK DELETE COMPLETED =====
router.delete('/:userId/completed', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Todo.deleteMany({ userId, completed: true });
    res.json({ message: 'Completed todos deleted', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('❌ Error deleting completed todos:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
