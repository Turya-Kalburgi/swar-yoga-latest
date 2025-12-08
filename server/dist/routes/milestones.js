import express from 'express';
import Milestone from '../models/Milestone.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const milestones = await Milestone.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: milestones });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const milestone = new Milestone({ userId, ...req.body });
        await milestone.save();
        res.status(201).json({ success: true, data: milestone });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!milestone) {
            res.status(404).json({ success: false, message: 'Milestone not found' });
            return;
        }
        res.json({ success: true, data: milestone });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const milestone = await Milestone.findByIdAndDelete(req.params.id);
        if (!milestone) {
            res.status(404).json({ success: false, message: 'Milestone not found' });
            return;
        }
        res.json({ success: true, message: 'Milestone deleted' });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
export default router;
//# sourceMappingURL=milestones.js.map