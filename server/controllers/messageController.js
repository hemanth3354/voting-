const Message = require('../models/messageModel');

// POST /api/messages
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newMessage = await Message.create({ name, email, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// GET /api/messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};
