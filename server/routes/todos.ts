import express, { Request, Response, Router } from 'express';
import Todo from '../models/Todo.js';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const todos = await Todo.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const todo = new Todo({ userId, ...req.body });
    await todo.save();
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) {
      res.status(404).json({ success: false, message: 'Todo not found' });
      return;
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      res.status(404).json({ success: false, message: 'Todo not found' });
      return;
    }
    res.json({ success: true, message: 'Todo deleted' });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

export default router;
