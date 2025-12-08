import express from 'express';
import Task from '../models/Task.js';
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: tasks });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.json({ success: true, data: task });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.post('/', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const task = new Task({ userId, ...req.body });
        await task.save();
        res.status(201).json({ success: true, data: task });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.json({ success: true, data: task });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }
        res.json({ success: true, message: 'Task deleted' });
    }
    catch (error) {
        const err = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: err });
    }
});
export default router;
//# sourceMappingURL=tasks.js.map