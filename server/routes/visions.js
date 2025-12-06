import express from 'express';
import Vision from '../models/Vision.js';

const router = express.Router();

// Middleware to extract userId from headers
const getUserIdFromHeaders = (req) => {
  return req.headers['x-user-id'] || req.body?.userId || req.query?.userId;
};

// Get all visions for a user (from headers or query)
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`📖 Fetching visions for userId: ${userId}`);
    const visions = await Vision.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${visions.length} visions for user ${userId}`);
    res.json(visions);
  } catch (error) {
    console.error(`❌ Error fetching visions:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get all visions for a user by userId parameter (backward compatibility)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📖 Fetching visions for userId (param): ${userId}`);
    const visions = await Vision.find({ userId }).sort({ createdAt: -1 });
    console.log(`✅ Found ${visions.length} visions for user ${userId}`);
    res.json(visions);
  } catch (error) {
    console.error(`❌ Error fetching visions:`, error);
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
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`✍️ Creating vision for userId: ${userId}`, req.body);
    
    const visionData = {
      ...req.body,
      userId,
    };

    const vision = new Vision(visionData);
    const saved = await vision.save();
    console.log(`✅ Vision created successfully:`, saved);
    res.status(201).json(saved);
  } catch (error) {
    console.error(`❌ Error creating vision:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update vision
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔄 Updating vision ${req.params.id} for userId: ${userId}`);
    
    const updated = await Vision.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Vision not found' });
    
    console.log(`✅ Vision updated successfully:`, updated);
    res.json(updated);
  } catch (error) {
    console.error(`❌ Error updating vision:`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete vision
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserIdFromHeaders(req);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🗑️ Deleting vision ${req.params.id} for userId: ${userId}`);
    
    const deleted = await Vision.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Vision not found' });
    
    console.log(`✅ Vision deleted successfully`);
    res.json({ message: 'Vision deleted successfully' });
  } catch (error) {
    console.error(`❌ Error deleting vision:`, error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
