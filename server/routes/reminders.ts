import express, { Request, Response, Router } from 'express';
import Reminder from '../models/Reminder.js';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const reminders = await Reminder.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reminders });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const reminder = new Reminder({ userId, ...req.body });
    await reminder.save();
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.json({ success: true, data: reminder });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

export default router;
