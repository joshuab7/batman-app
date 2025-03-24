// src/routes/characterRoutes.js

const express = require('express');
const characterHandler = require('../route-handlers/character-handler');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', characterHandler.getCharacters);
router.get('/search', characterHandler.searchCharacters);
router.get('/:id', characterHandler.getCharacterById);

// Protected routes (require authentication)
router.get('/user/favorites', authenticateToken, characterHandler.getFavorites);
router.get('/user/recommendations', authenticateToken, characterHandler.getRecommendations);
router.post('/:id/favorite', authenticateToken, characterHandler.addToFavorites);
router.delete('/:id/favorite', authenticateToken, characterHandler.removeFromFavorites);
router.post('/:id/rate', authenticateToken, characterHandler.rateCharacter);

module.exports = router;