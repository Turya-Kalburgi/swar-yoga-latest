import express from 'express';
import Milestone from '../models/Milestone.js';
import Goal from '../models/Goal.js';
import Vision from '../models/Vision.js';
import Task from '../models/Task.js';
import Todo from '../models/Todo.js';

const router = express.Router();

// ===== GET ALL MILESTONES =====
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, goalId, visionId } = req.query;

    let query = { userId };

    if (status) query.status = status;
    if (goalId) query.goalId = goalId;
    if (visionId) query.visionId = visionId;

    const milestones = await Milestone.find(query)
      .sort({ dueDate: 1 })
      .lean();

    res.json({
      success: true,
      data: milestones
    });
  } catch (error) {
    console.error('❌ Error fetching milestones:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching milestones',
      error: error.message
    });
  }
});

// ===== GET SINGLE MILESTONE =====
router.get('/:userId/:milestoneId', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;

    const milestone = await Milestone.findOne({ _id: milestoneId, userId });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    res.json({
      success: true,
      data: milestone
    });
  } catch (error) {
    console.error('❌ Error fetching milestone:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching milestone',
      error: error.message
    });
  }
});

// ===== CREATE MILESTONE WITH VISION & GOAL =====
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      visionId,
      goalId,
      title,
      description,
      startDate,
      dueDate,
      priority,
      keyResults,
      deliverables
    } = req.body;

    if (!userId || !goalId || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'userId, goalId, title, and dueDate are required'
      });
    }

    // Fetch goal to get its title
    const goal = await Goal.findOne({ _id: goalId, userId });
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Fetch vision if provided
    let visionTitle = '';
    if (visionId) {
      const vision = await Vision.findOne({ _id: visionId, userId });
      visionTitle = vision?.visionStatement || '';
    }

    const newMilestone = new Milestone({
      userId,
      visionId: visionId || '',
      visionTitle,
      goalId,
      goalTitle: goal.goalTitle,
      title,
      description: description || '',
      startDate: startDate || new Date(),
      dueDate: new Date(dueDate),
      priority: priority || 'Medium',
      keyResults: keyResults || [],
      deliverables: deliverables || []
    });

    await newMilestone.save();

    // Update goal's milestones array
    if (!goal.milestones) {
      goal.milestones = [];
    }
    goal.milestones.push(newMilestone._id);
    goal.progressPercentage = 0;
    await goal.save();

    console.log(`✅ Milestone created: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: newMilestone
    });
  } catch (error) {
    console.error('❌ Error creating milestone:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating milestone',
      error: error.message
    });
  }
});

// ===== UPDATE MILESTONE =====
router.put('/:userId/:milestoneId', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;
    const updates = req.body;

    // Don't allow direct userId changes
    delete updates.userId;
    delete updates.createdAt;

    const milestone = await Milestone.findOneAndUpdate(
      { _id: milestoneId, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    console.log(`✅ Milestone updated: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: milestone
    });
  } catch (error) {
    console.error('❌ Error updating milestone:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating milestone',
      error: error.message
    });
  }
});

// ===== LINK VISION TO MILESTONE =====
router.post('/:userId/:milestoneId/link-vision', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;
    const { visionId } = req.body;

    // Get vision
    const vision = await Vision.findOne({ _id: visionId, userId });
    if (!vision) {
      return res.status(404).json({
        success: false,
        message: 'Vision not found'
      });
    }

    // Update milestone
    const milestone = await Milestone.findOneAndUpdate(
      { _id: milestoneId, userId },
      {
        visionId,
        visionTitle: vision.visionStatement,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    console.log(`✅ Vision linked to milestone: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Vision linked successfully',
      data: milestone
    });
  } catch (error) {
    console.error('❌ Error linking vision:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error linking vision',
      error: error.message
    });
  }
});

// ===== LINK TASKS TO MILESTONE =====
router.post('/:userId/:milestoneId/add-tasks', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'taskIds must be a non-empty array'
      });
    }

    // Verify tasks exist
    const tasks = await Task.find({ _id: { $in: taskIds }, userId });
    if (tasks.length !== taskIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Some tasks not found'
      });
    }

    // Update milestone
    const milestone = await Milestone.findOneAndUpdate(
      { _id: milestoneId, userId },
      {
        $addToSet: { linkedTasks: { $each: taskIds } },
        tasksCount: taskIds.length,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    console.log(`✅ ${taskIds.length} tasks added to milestone: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Tasks linked successfully',
      data: milestone
    });
  } catch (error) {
    console.error('❌ Error linking tasks:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error linking tasks',
      error: error.message
    });
  }
});

// ===== LINK TODOS TO MILESTONE =====
router.post('/:userId/:milestoneId/add-todos', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;
    const { todoIds } = req.body;

    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'todoIds must be a non-empty array'
      });
    }

    // Verify todos exist
    const todos = await Todo.find({ _id: { $in: todoIds }, userId });
    if (todos.length !== todoIds.length) {
      return res.status(404).json({
        success: false,
        message: 'Some todos not found'
      });
    }

    // Update milestone
    const milestone = await Milestone.findOneAndUpdate(
      { _id: milestoneId, userId },
      {
        $addToSet: { linkedTodos: { $each: todoIds } },
        todosCount: todoIds.length,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    console.log(`✅ ${todoIds.length} todos added to milestone: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Todos linked successfully',
      data: milestone
    });
  } catch (error) {
    console.error('❌ Error linking todos:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error linking todos',
      error: error.message
    });
  }
});

// ===== DELETE MILESTONE =====
router.delete('/:userId/:milestoneId', async (req, res) => {
  try {
    const { userId, milestoneId } = req.params;

    const milestone = await Milestone.findOneAndDelete({ _id: milestoneId, userId });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    // Remove from goal's milestones array
    await Goal.updateOne(
      { _id: milestone.goalId },
      { $pull: { milestones: milestoneId } }
    );

    console.log(`✅ Milestone deleted: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Milestone deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting milestone:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting milestone',
      error: error.message
    });
  }
});

export default router;
