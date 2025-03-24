const express = require('express');
const userHandler = require('../route-handlers/user-handler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
router.post('/register', userHandler.register);
router.post('/login', userHandler.login);
router.get('/profile', authenticateToken, userHandler.getProfile);
router.put('/theme', authenticateToken, userHandler.updateTheme);

module.exports = router;