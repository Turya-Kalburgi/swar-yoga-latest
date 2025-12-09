import express, { Request, Response, Router } from 'express';
import Task from '../models/Task.js';

const router: Router = express.Router();

/**
 * Helper function to extract user ID from headers
 */
function getUserId(req: Request): string {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    console.warn('⚠️ Missing X-User-ID header in tasks route');
  }
  return userId || 'anonymous';
}

/**
 * GET /api/tasks
 * Fetch all tasks for the current user
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    console.log(`✓ Fetching tasks for user: ${userId}`);

    const tasks = await Task.find({ userId }).lean().sort({ createdAt: -1 });

    console.log(`✅ Found ${tasks.length} tasks`);
    res.json({
      success: true,
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching tasks:', message);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * GET /api/tasks/:id
 * Fetch a single task by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    const task = await Task.findOne({ _id: req.params.id, userId });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
        id: req.params.id,
      });
      return;
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error fetching task:', message);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    console.log(`✏️ Creating new task for user: ${userId}`);

    if (!req.body.title) {
      res.status(400).json({
        success: false,
        message: 'Title is required',
      });
      return;
    }

    const task = new Task({
      userId,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await task.save();

    console.log(`✅ Task created: ${task._id}`);
    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error creating task:', message);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    console.log(`🔄 Updating task ${req.params.id} for user: ${userId}`);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        ...req.body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    console.log(`✅ Task updated: ${task._id}`);
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error updating task:', message);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    console.log(`🗑️ Deleting task ${req.params.id} for user: ${userId}`);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
      });
      return;
    }

    console.log(`✅ Task deleted: ${req.params.id}`);
    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error deleting task:', message);
    res.status(500).json({
      success: false,
      error: message,
    });
  }
});

export default router;
