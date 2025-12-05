import express from 'express';
import DailyPlan from '../models/DailyPlan.js';

const router = express.Router();

// Get all plans for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await DailyPlan.find({ userId }).sort({ date: -1, time: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get plans for a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const plans = await DailyPlan.find({ userId, date }).sort({ time: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single plan
router.get('/single/:id', async (req, res) => {
  try {
    const plan = await DailyPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create plan
router.post('/', async (req, res) => {
  try {
    const plan = new DailyPlan(req.body);
    const saved = await plan.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update plan
router.put('/:id', async (req, res) => {
  try {
    const updated = await DailyPlan.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Plan not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete plan
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await DailyPlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Plan not found' });
    res.json({ message: 'Plan deleted', data: deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
