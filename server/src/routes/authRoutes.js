const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateSettings } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validateRequest,
  ],
  register
);

router.post(
  '/login',
  [
    body('loginIdentifier').notEmpty().withMessage('Username or Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest,
  ],
  login
);

router.get('/me', verifyToken, getMe);
router.put('/settings', verifyToken, updateSettings);

module.exports = router;
