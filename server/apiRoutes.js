const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('./api/controllers/authController');
const photoController = require('./api/controllers/photoController');

const router = express.Router();

// JWT middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }
  try {
    const decoded = jwt.verify(token, 'mysecretkey123');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-reset-password', authController.requestResetPassword);
router.post('/reset-password', authController.resetPassword);

// Photo routes
router.post('/photos/upload', authenticateToken, photoController.uploadPhoto);
router.patch('/photos/:photoId/toggle-active', authenticateToken, photoController.togglePhotoActive);
router.patch('/photos/:photoId/filters', authenticateToken, photoController.setPhotoFilters);
router.get('/photos/rating', authenticateToken, photoController.getPhotosForRating);
router.post('/photos/:photoId/rate', authenticateToken, photoController.ratePhoto);

// Example routes (retained from original)
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
