const express = require('express');
const router = express.Router();
const { chatWithGemini, getHistory } = require('../controllers/chatController');
const verifyToken = require('../middleware/verifyToken');

// Chat routes
router.post('/message', verifyToken, chatWithGemini);
router.get('/history', verifyToken, getHistory);

module.exports = router; 