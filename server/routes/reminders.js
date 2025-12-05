import express from 'express';
import Reminder from '../models/Reminder.js';

const router = express.Router();

// ===== GET ALL REMINDERS =====
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, reminderType, milestoneId } = req.query;

    let query = { userId };

    if (status) query.status = status;
    if (reminderType) query.reminderType = reminderType;
    if (milestoneId) query.milestoneId = milestoneId;

    const reminders = await Reminder.find(query)
      .sort({ reminderDate: 1 })
      .lean();

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('❌ Error fetching reminders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message
    });
  }
});

// ===== GET SINGLE REMINDER =====
router.get('/:userId/:reminderId', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOne({ _id: reminderId, userId });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error fetching reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminder',
      error: error.message
    });
  }
});

// ===== CREATE REMINDER =====
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      reminderType,
      relatedId,
      relatedTitle,
      milestoneId,
      milestoneDueDate,
      title,
      description,
      reminderDate,
      reminderTime,
      priority,
      isRecurring,
      recurrencePattern,
      recurrenceEnd,
      notificationChannels
    } = req.body;

    if (!userId || !title || !reminderDate) {
      return res.status(400).json({
        success: false,
        message: 'userId, title, and reminderDate are required'
      });
    }

    const newReminder = new Reminder({
      userId,
      reminderType: reminderType || 'Custom',
      relatedId: relatedId || '',
      relatedTitle: relatedTitle || '',
      milestoneId: milestoneId || '',
      milestoneDueDate: milestoneDueDate || null,
      title,
      description: description || '',
      reminderDate: new Date(reminderDate),
      reminderTime: reminderTime || '09:00',
      priority: priority || 'Medium',
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || 'Daily',
      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
      notificationChannels: notificationChannels || {
        email: true,
        inApp: true,
        sms: false,
        whatsapp: false,
        browser: true
      }
    });

    await newReminder.save();

    console.log(`✅ Reminder created: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: newReminder
    });
  } catch (error) {
    console.error('❌ Error creating reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating reminder',
      error: error.message
    });
  }
});

// ===== UPDATE REMINDER =====
router.put('/:userId/:reminderId', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;
    const updates = req.body;

    delete updates.userId;
    delete updates.createdAt;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder updated: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error updating reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder',
      error: error.message
    });
  }
});

// ===== SNOOZE REMINDER =====
router.post('/:userId/:reminderId/snooze', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;
    const { snoozeMinutes = 15 } = req.body;

    const snoozedUntil = new Date(Date.now() + snoozeMinutes * 60 * 1000);

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      {
        status: 'Snoozed',
        snoozedUntil,
        snoozeCount: Reminder.snoozeCount + 1,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder snoozed for ${snoozeMinutes} minutes: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder snoozed successfully',
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error snoozing reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error snoozing reminder',
      error: error.message
    });
  }
});

// ===== DISMISS REMINDER =====
router.post('/:userId/:reminderId/dismiss', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      {
        status: 'Dismissed',
        dismissedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder dismissed: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder dismissed successfully',
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error dismissing reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error dismissing reminder',
      error: error.message
    });
  }
});

// ===== MARK REMINDER AS COMPLETED =====
router.post('/:userId/:reminderId/complete', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      {
        status: 'Completed',
        isCompleted: true,
        completedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder completed: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder marked as completed',
      data: reminder
    });
  } catch (error) {
    console.error('❌ Error completing reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error completing reminder',
      error: error.message
    });
  }
});

// ===== DELETE REMINDER =====
router.delete('/:userId/:reminderId', async (req, res) => {
  try {
    const { userId, reminderId } = req.params;

    const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    console.log(`✅ Reminder deleted: ${reminder.title}`);

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting reminder:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message
    });
  }
});

// ===== GET UPCOMING REMINDERS =====
router.get('/:userId/upcoming', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const upcomingReminders = await Reminder.find({
      userId,
      status: { $in: ['Active', 'Snoozed'] },
      reminderDate: { $gte: today, $lte: futureDate }
    })
      .sort({ reminderDate: 1 })
      .lean();

    res.json({
      success: true,
      data: upcomingReminders
    });
  } catch (error) {
    console.error('❌ Error fetching upcoming reminders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming reminders',
      error: error.message
    });
  }
});

export default router;
