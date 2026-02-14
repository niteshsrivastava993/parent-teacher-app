const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('./messageModel');
const User = require('./userModel');

const router = express.Router();
const JWT_SECRET = 'your-secret-key-here';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users (for selecting recipients)
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } })
      .select('name email role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { receiverId, subject, content } = req.body;

    const message = new Message({
      sender: req.user.userId,
      receiver: receiverId,
      subject,
      content
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages (received)
router.get('/received', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.userId })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages (sent)
router.get('/sent', verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.userId })
      .populate('receiver', 'name email role')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;