import express from 'express';
import Goal from '../models/Goal.js';

const router = express.Router();

// Middleware to extract userId from headers
const getUserIdFromHeaders = (req) => {
  return req.headers['x-user-id'] || req.body?.userId || req.query?.userId;
};

// Get all goals for a user (from headers or query)
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🎯 Fetching goals for userId: ${userId}`);
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${goals.length} goals for user ${userId}`);
    res.json(goals);
  } catch (error) {
    console.error(`❌ Error fetching goals:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get all goals for a user by userId parameter (backward compatibility)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🎯 Fetching goals for userId (param): ${userId}`);
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${goals.length} goals for user ${userId}`);
    res.json(goals);
  } catch (error) {
    console.error(`❌ Error fetching goals:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get single goal
router.get('/single/:id', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create goal
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`✍️ Creating goal for userId: ${userId}`, req.body);
    
    const goalData = {
      ...req.body,
      userId,
    };

    const goal = new Goal(goalData);
    const saved = await goal.save();
    console.log(`✅ Goal created successfully:`, saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error(`❌ Error creating goal:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update goal
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔄 Updating goal ${req.params.id} for userId: ${userId}`);
    
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Goal not found' });
    
    console.log(`✅ Goal updated successfully:`, updated);
    res.json(updated);
  } catch (error) {
    console.error(`❌ Error updating goal:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete goal
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🗑️ Deleting goal ${req.params.id} for userId: ${userId}`);
    
    const deleted = await Goal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Goal not found' });
    
    console.log(`✅ Goal deleted successfully`);
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting goal:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
