const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  triggerHabit,
} = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

// All task routes require authentication
router.use(verifyToken);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title').trim().notEmpty().withMessage('Quest title is required'),
      body('type').optional().isIn(['TODO', 'DAILY', 'HABIT']).withMessage('Invalid quest type'),
      body('stat')
        .optional()
        .isIn(['intellect', 'strength', 'agility', 'vitality', 'wisdom', 'charisma'])
        .withMessage('Invalid attribute category'),
      body('difficulty')
        .optional()
        .isIn(['TRIVIAL', 'EASY', 'MEDIUM', 'HARD', 'EPIC'])
        .withMessage('Invalid difficulty tier'),
      validateRequest,
    ],
    createTask
  );

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.post('/:id/complete', completeTask);
router.post('/:id/habit', triggerHabit);

module.exports = router;
