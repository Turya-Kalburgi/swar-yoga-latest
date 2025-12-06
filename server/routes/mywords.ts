import express, { Request, Response, Router } from 'express';
import MyWord from '../models/MyWord.js';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const words = await MyWord.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: words });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const word = new MyWord({ userId, ...req.body });
    await word.save();
    res.status(201).json({ success: true, data: word });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const word = await MyWord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }
    res.json({ success: true, data: word });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const word = await MyWord.findByIdAndDelete(req.params.id);
    if (!word) {
      res.status(404).json({ success: false, message: 'Word not found' });
      return;
    }
    res.json({ success: true, message: 'Word deleted' });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

export default router;
