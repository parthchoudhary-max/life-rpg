const express = require('express');
const { getActivityLogs, getSummaryStats } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

router.get('/logs', getActivityLogs);
router.get('/summary', getSummaryStats);

module.exports = router;
