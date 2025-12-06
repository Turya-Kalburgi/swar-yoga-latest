import express from 'express';
import MyWord from '../models/MyWord.js';

const router = express.Router();

// Middleware to extract userId from headers
const getUserIdFromHeaders = (req) => {
  return req.headers['x-user-id'] || req.body?.userId || req.query?.userId;
};

// Get all mywords for a user (from headers or query)
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`📝 Fetching words for userId: ${userId}`);
    const words = await MyWord.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${words.length} words for user ${userId}`);
    res.json(words);
  } catch (error) {
    console.error(`❌ Error fetching words:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get all mywords for a user by userId parameter (backward compatibility)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📝 Fetching words for userId (param): ${userId}`);
    const words = await MyWord.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${words.length} words for user ${userId}`);
    res.json(words);
  } catch (error) {
    console.error(`❌ Error fetching words:`, error);
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
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`✍️ Creating word for userId: ${userId}`, req.body);
    
    const wordData = {
      ...req.body,
      userId,
    };

    const word = new MyWord(wordData);
    const saved = await word.save();
    console.log(`✅ Word created successfully:`, saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error(`❌ Error creating word:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update myword
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔄 Updating word ${req.params.id} for userId: ${userId}`);
    
    const updated = await MyWord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Word not found' });
    
    console.log(`✅ Word updated successfully:`, updated);
    res.json(updated);
  } catch (error) {
    console.error(`❌ Error updating word:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete myword
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🗑️ Deleting word ${req.params.id} for userId: ${userId}`);
    
    const deleted = await MyWord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Word not found' });
    
    console.log(`✅ Word deleted successfully`);
    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting word:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
