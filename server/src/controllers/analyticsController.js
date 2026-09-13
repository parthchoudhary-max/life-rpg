const ActivityLog = require('../models/ActivityLog');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get historical activity logs for current user
// @route   GET /api/analytics/logs
// @access  Private
const getActivityLogs = async (req, res, next) => {
  try {
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 30);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics & stat distribution
// @route   GET /api/analytics/summary
// @access  Private
const getSummaryStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const totalTasksCompleted = await Task.countDocuments({
      user: req.user._id,
      completed: true,
    });

    const activeTasksCount = await Task.countDocuments({
      user: req.user._id,
      completed: false,
      isArchived: false,
    });

    // Aggregate completed tasks by attribute
    const tasksByStat = await Task.aggregate([
      { $match: { user: user._id, completed: true } },
      { $group: { _id: '$stat', count: { $sum: 1 } } },
    ]);

    const statDistribution = {};
    tasksByStat.forEach((item) => {
      statDistribution[item._id] = item.count;
    });

    res.json({
      success: true,
      summary: {
        level: user.character.level,
        title: user.character.title,
        totalXp: user.character.totalXp,
        currentStreak: user.streak.current,
        longestStreak: user.streak.longest,
        gold: user.character.gold,
        gems: user.character.gems,
        totalTasksCompleted,
        activeTasksCount,
        statDistribution,
        attributes: user.character.attributes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
  getSummaryStats,
};
