import express from 'express';
import Goal from '../models/Goal.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: goals });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
            res.status(404).json({ success: false, message: 'Goal not found' });
            return;
        }
        res.json({ success: true, data: goal });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const goal = new Goal({ userId, ...req.body });
        await goal.save();
        res.status(201).json({ success: true, data: goal });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!goal) {
            res.status(404).json({ success: false, message: 'Goal not found' });
            return;
        }
        res.json({ success: true, data: goal });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const goal = await Goal.findByIdAndDelete(req.params.id);
        if (!goal) {
            res.status(404).json({ success: false, message: 'Goal not found' });
            return;
        }
        res.json({ success: true, message: 'Goal deleted' });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
export default router;
//# sourceMappingURL=goals.js.map