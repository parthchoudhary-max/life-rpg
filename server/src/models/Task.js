const mongoose = require('mongoose');
const { ATTRIBUTES, DIFFICULTY_REWARDS, TASK_TYPES } = require('../config/constants');

const taskHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  action: {
    type: String,
    enum: ['COMPLETED', 'HABIT_PLUS', 'HABIT_MINUS', 'UNCOMPLETED', 'MISSED'],
    required: true,
  },
  xpEarned: { type: Number, default: 0 },
  goldEarned: { type: Number, default: 0 },
  damageTaken: { type: Number, default: 0 },
});

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    type: {
      type: String,
      enum: Object.keys(TASK_TYPES),
      default: TASK_TYPES.TODO,
      required: true,
    },
    stat: {
      type: String,
      enum: Object.values(ATTRIBUTES),
      default: ATTRIBUTES.INTELLECT,
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.keys(DIFFICULTY_REWARDS),
      default: 'MEDIUM',
      required: true,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    // For Habits
    habitType: {
      type: String,
      enum: ['POSITIVE', 'NEGATIVE', 'BOTH'],
      default: 'BOTH',
    },
    positiveCount: {
      type: Number,
      default: 0,
    },
    negativeCount: {
      type: Number,
      default: 0,
    },
    // For Dailies & Habits: consecutive completions
    streak: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    history: [taskHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup
taskSchema.index({ user: 1, type: 1, completed: 1 });
taskSchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model('Task', taskSchema);
