import express from 'express';
import Contact from '../models/Contact.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// ===== GET ALL CONTACT MESSAGES =====
router.get('/messages', async (req, res) => {
  try {
    const { status, priority, sortBy = '-submittedAt', limit = 100, skip = 0 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    const messages = await Contact.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        remaining: total - (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
});

// ===== GET SINGLE MESSAGE =====
router.get('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOne({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('❌ Error fetching message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching message',
      error: error.message
    });
  }
});

// ===== CREATE NEW CONTACT MESSAGE =====
router.post('/messages', async (req, res) => {
  try {
    const { name, email, countryCode, whatsapp, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const contactId = uuidv4();

    // Check if similar message already exists (prevent duplicates within 1 minute)
    const recentMessage = await Contact.findOne({
      email: normalizedEmail,
      subject: subject.trim(),
      submittedAt: { $gte: new Date(Date.now() - 60000) }
    });

    if (recentMessage) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate message detected. Please wait before sending again.'
      });
    }

    // Create new contact message
    const newContact = new Contact({
      contactId,
      name: name.trim(),
      email: normalizedEmail,
      countryCode: countryCode || '+91',
      whatsapp: whatsapp ? whatsapp.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
      status: 'unread',
      priority: 'medium',
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      submittedAt: new Date(),
      metadata: {
        device: req.body.deviceType || 'web',
        browser: req.body.browser || 'unknown'
      }
    });

    await newContact.save();

    console.log(`✅ New contact message saved: ${contactId}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        contactId: newContact.contactId,
        email: newContact.email,
        subject: newContact.subject,
        submittedAt: newContact.submittedAt
      }
    });
  } catch (error) {
    console.error('❌ Error creating contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
});

// ===== UPDATE MESSAGE STATUS & REPLY =====
router.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, replyMessage, assignedTo } = req.body;

    const message = await Contact.findOne({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update fields
    if (status) {
      message.status = status;
    }

    if (priority) {
      message.priority = priority;
    }

    if (replyMessage) {
      message.replyMessage = replyMessage;
      message.repliedAt = new Date();
      message.status = 'replied';
    }

    if (assignedTo) {
      message.assignedTo = assignedTo;
    }

    await message.save();

    console.log(`✅ Contact message ${id} updated`);

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('❌ Error updating contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating message',
      error: error.message
    });
  }
});

// ===== DELETE MESSAGE =====
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Contact.findOneAndDelete({
      $or: [{ contactId: id }, { _id: id }]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    console.log(`✅ Contact message ${id} deleted`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

// ===== GET STATISTICS =====
router.get('/stats/overview', async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const unread = await Contact.countDocuments({ status: 'unread' });
    const replied = await Contact.countDocuments({ status: 'replied' });
    const closed = await Contact.countDocuments({ status: 'closed' });
    const high = await Contact.countDocuments({ priority: 'high' });

    res.json({
      success: true,
      data: {
        total,
        unread,
        replied,
        closed,
        highPriority: high,
        responseRate: total > 0 ? ((replied / total) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

export default router;
