import express from 'express';
import MyWord from '../models/MyWord.js';

const router = express.Router();

// Get all mywords for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const words = await MyWord.find({ userId }).sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single myword
router.get('/single/:id', async (req, res) => {
  try {
    const word = await MyWord.findById(req.params.id);
    if (!word) return res.status(404).json({ error: 'Word not found' });
    res.json(word);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create myword
router.post('/', async (req, res) => {
  try {
    const word = new MyWord(req.body);
    const saved = await word.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update myword
router.put('/:id', async (req, res) => {
  try {
    const updated = await MyWord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Word not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete myword
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MyWord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Word not found' });
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
