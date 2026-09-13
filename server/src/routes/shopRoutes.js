const express = require('express');
const { body } = require('express-validator');
const {
  getShopItems,
  purchaseItem,
  equipItem,
  createCustomReward,
  deleteCustomReward,
} = require('../controllers/shopController');
const { verifyToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.use(verifyToken);

router.get('/', getShopItems);
router.post('/purchase/:id', purchaseItem);
router.post('/equip/:itemId', equipItem);

router.post(
  '/custom-reward',
  [
    body('name').trim().notEmpty().withMessage('Reward name is required'),
    body('costGold').isInt({ min: 1 }).withMessage('Gold cost must be at least 1'),
    validateRequest,
  ],
  createCustomReward
);

router.delete('/custom-reward/:id', deleteCustomReward);

module.exports = router;
