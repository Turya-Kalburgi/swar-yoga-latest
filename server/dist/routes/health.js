import express from 'express';
import HealthTracker from '../models/HealthTracker.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const records = await HealthTracker.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: records });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const record = new HealthTracker({ userId, ...req.body });
        await record.save();
        res.status(201).json({ success: true, data: record });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const record = await HealthTracker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!record) {
            res.status(404).json({ success: false, message: 'Record not found' });
            return;
        }
        res.json({ success: true, data: record });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const record = await HealthTracker.findByIdAndDelete(req.params.id);
        if (!record) {
            res.status(404).json({ success: false, message: 'Record not found' });
            return;
        }
        res.json({ success: true, message: 'Record deleted' });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
export default router;
//# sourceMappingURL=health.js.map