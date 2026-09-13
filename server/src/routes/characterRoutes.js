const express = require('express');
const { consumePotion, getCharacterStats } = require('../controllers/characterController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/stats', getCharacterStats);
router.post('/consume/:itemId', consumePotion);

module.exports = router;
