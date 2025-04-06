const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createChat, getChats, sendMessage } = require('../controllers/chatController');

// Protected routes
router.use(verifyToken);

// Chat routes
router.post('/create', createChat);
router.get('/history', getChats);
router.post('/message', sendMessage);

module.exports = router; 