import express from 'express';
import Vision from '../models/Vision.js';
const router = express.Router();
function getUserId(req) { return req.headers['x-user-id'] || 'anonymous'; }
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const visions = await Vision.find({ userId }).lean();
        res.json({ success: true, data: visions });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown';
        res.status(500).json({ success: false, error: msg });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        const vision = new Vision({ userId, ...req.body });
        await vision.save();
        res.status(201).json({ success: true, data: vision });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown';
        res.status(500).json({ success: false, error: msg });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const vision = await Vision.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
        if (!vision) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data: vision });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown';
        res.status(500).json({ success: false, error: msg });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        const vision = await Vision.findOneAndDelete({ _id: req.params.id, userId });
        if (!vision) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, message: 'Deleted' });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown';
        res.status(500).json({ success: false, error: msg });
    }
});
export default router;
//# sourceMappingURL=visions.js.map