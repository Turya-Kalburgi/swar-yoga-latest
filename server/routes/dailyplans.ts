import express, { Request, Response, Router } from 'express';
import DailyPlan from '../models/DailyPlan.js';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const plans = await DailyPlan.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const plan = new DailyPlan({ userId, ...req.body });
    await plan.save();
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await DailyPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await DailyPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }
    res.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    const err = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: err });
  }
});

export default router;
