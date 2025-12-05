import express from 'express';
import HealthTracker from '../models/HealthTracker.js';

const router = express.Router();

// Get health data for a user on a specific date
router.get('/:userId/:date', async (req, res) => {
  try {
    const { userId, date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const health = await HealthTracker.findOne({
      userId,
      date: { $gte: startDate, $lt: endDate }
    });

    res.json(health || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all health data for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const health = await HealthTracker.find({ userId }).sort({ date: -1 });
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update health data
router.post('/', async (req, res) => {
  try {
    const { userId, date } = req.body;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    let health = await HealthTracker.findOne({
      userId,
      date: { $gte: startDate, $lt: endDate }
    });

    if (health) {
      Object.assign(health, req.body);
      await health.save();
    } else {
      health = new HealthTracker(req.body);
      await health.save();
    }

    res.status(201).json(health);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update health data
router.put('/:id', async (req, res) => {
  try {
    const updated = await HealthTracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Health record not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete health data
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await HealthTracker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Health record not found' });
    res.json({ message: 'Health record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
