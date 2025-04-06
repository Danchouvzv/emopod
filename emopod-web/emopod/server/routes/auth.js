const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/me', verifyToken, getMe);

module.exports = router; 