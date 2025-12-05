import express from 'express';
import Vision from '../models/Vision.js';

const router = express.Router();

// Get all visions for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const visions = await Vision.find({ userId }).sort({ createdAt: -1 });
    res.json(visions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single vision
router.get('/single/:id', async (req, res) => {
  try {
    const vision = await Vision.findById(req.params.id);
    if (!vision) return res.status(404).json({ error: 'Vision not found' });
    res.json(vision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create vision
router.post('/', async (req, res) => {
  try {
    const vision = new Vision(req.body);
    const saved = await vision.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update vision
router.put('/:id', async (req, res) => {
  try {
    const updated = await Vision.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Vision not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete vision
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Vision.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vision not found' });
    res.json({ message: 'Vision deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
