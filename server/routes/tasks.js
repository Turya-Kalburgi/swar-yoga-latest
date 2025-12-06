import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Middleware to extract userId from headers
const getUserIdFromHeaders = (req) => {
  return req.headers['x-user-id'] || req.body?.userId || req.query?.userId;
};

// Get all tasks for a user (from headers or query)
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`✓ Fetching tasks for userId: ${userId}`);
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${tasks.length} tasks for user ${userId}`);
    res.json(tasks);
  } catch (error) {
    console.error(`❌ Error fetching tasks:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks for a user by userId parameter (backward compatibility)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`✓ Fetching tasks for userId (param): ${userId}`);
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${tasks.length} tasks for user ${userId}`);
    res.json(tasks);
  } catch (error) {
    console.error(`❌ Error fetching tasks:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get single task
router.get('/single/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`✍️ Creating task for userId: ${userId}`, req.body);
    
    const taskData = {
      ...req.body,
      userId,
    };

    const task = new Task(taskData);
    const saved = await task.save();
    console.log(`✅ Task created successfully:`, saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error(`❌ Error creating task:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔄 Updating task ${req.params.id} for userId: ${userId}`);
    
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    
    console.log(`✅ Task updated successfully:`, updated);
    res.json(updated);
  } catch (error) {
    console.error(`❌ Error updating task:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🗑️ Deleting task ${req.params.id} for userId: ${userId}`);
    
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    
    console.log(`✅ Task deleted successfully`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting task:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
