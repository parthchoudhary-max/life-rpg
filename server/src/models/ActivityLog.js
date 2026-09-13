const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'QUEST_COMPLETED',
        'HABIT_TRACKED',
        'DAILY_COMPLETED',
        'LEVEL_UP',
        'ITEM_PURCHASED',
        'ITEM_EQUIPPED',
        'POTION_CONSUMED',
        'STREAK_MILESTONE',
        'PENALTY_INCURRED',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    goldEarned: {
      type: Number,
      default: 0,
    },
    gemsEarned: {
      type: Number,
      default: 0,
    },
    statGains: {
      stat: { type: String },
      amount: { type: Number, default: 0 },
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
