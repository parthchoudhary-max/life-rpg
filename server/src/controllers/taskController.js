const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const {
  DIFFICULTY_REWARDS,
  ATTRIBUTES,
  TASK_TYPES,
  processProgression,
  updateStreak,
  getStreakMultiplier,
  getTitleForLevel,
} = require('../config/constants');

// @desc    Get all tasks for current authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { type, stat, completed, search } = req.query;

    const query = { user: req.user._id, isArchived: false };

    if (type && Object.keys(TASK_TYPES).includes(type)) {
      query.type = type;
    }
    if (stat && Object.values(ATTRIBUTES).includes(stat)) {
      query.stat = stat;
    }
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(query).sort({ completed: 1, createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task / quest
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      stat,
      difficulty,
      dueDate,
      habitType,
      tags,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Quest title is required' });
    }

    const task = new Task({
      user: req.user._id,
      title,
      description: description || '',
      type: type || TASK_TYPES.TODO,
      stat: stat || ATTRIBUTES.INTELLECT,
      difficulty: difficulty || 'MEDIUM',
      dueDate: dueDate || null,
      habitType: habitType || 'BOTH',
      tags: Array.isArray(tags) ? tags : [],
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'New quest posted on the adventurer notice board!',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, stat, difficulty, dueDate, habitType, tags } = req.body;

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (stat) task.stat = stat;
    if (difficulty) task.difficulty = difficulty;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (habitType) task.habitType = habitType;
    if (tags) task.tags = tags;

    await task.save();

    res.json({
      success: true,
      message: 'Quest details updated',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or archive a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    res.json({
      success: true,
      message: 'Quest removed from log',
      taskId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a quest or daily task (Triggers XP, Gold, Stats, Level-Up)
// @route   POST /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    if (task.completed && task.type === TASK_TYPES.TODO) {
      return res.status(400).json({ success: false, message: 'Quest is already completed' });
    }

    const user = await User.findById(req.user._id);
    const difficultyConfig = DIFFICULTY_REWARDS[task.difficulty] || DIFFICULTY_REWARDS.MEDIUM;

    // Calculate streak bonus
    const streakMult = getStreakMultiplier(user.streak.current);
    const xpGained = Math.round(difficultyConfig.xp * streakMult);
    const goldGained = Math.round(difficultyConfig.gold * (user.character.class === 'ALCHEMIST' ? 1.2 : 1.0));
    const gemsGained = difficultyConfig.gems || 0;
    const statGained = difficultyConfig.statPoints || 2;

    // Progression & Level-Up Math
    const progressionResult = processProgression(
      user.character.level,
      user.character.currentXp,
      xpGained
    );

    // Apply attribute boost
    const statKey = task.stat || ATTRIBUTES.INTELLECT;
    user.character.attributes[statKey] = (user.character.attributes[statKey] || 10) + statGained;

    // Apply currency & XP
    user.character.currentXp = progressionResult.newXp;
    user.character.totalXp += xpGained;
    user.character.gold += goldGained + progressionResult.bonusGold;
    user.character.gems += gemsGained;

    // If leveled up
    if (progressionResult.leveledUp) {
      user.character.level = progressionResult.newLevel;
      user.character.title = progressionResult.newTitle;
      user.character.hp.max += 10 * progressionResult.levelUps;
      user.character.hp.current = user.character.hp.max; // Full heal on level-up
    }

    // Update streak
    const streakResult = updateStreak(
      user.streak.lastActiveDate,
      user.streak.current,
      user.streak.longest
    );
    user.streak.current = streakResult.currentStreak;
    user.streak.longest = streakResult.longestStreak;
    user.streak.lastActiveDate = streakResult.lastActiveDate;

    // Mark task state
    task.completed = true;
    task.completedAt = new Date();
    task.streak = (task.streak || 0) + 1;
    task.lastCompletedDate = new Date();
    task.history.push({
      date: new Date(),
      action: 'COMPLETED',
      xpEarned: xpGained,
      goldEarned: goldGained,
    });

    await task.save();
    await user.save();

    // Create persistent Activity Logs in MongoDB
    await ActivityLog.create({
      user: user._id,
      type: task.type === TASK_TYPES.DAILY ? 'DAILY_COMPLETED' : 'QUEST_COMPLETED',
      title: `Quest Completed: ${task.title}`,
      details: `Awarded +${xpGained} XP, +${goldGained} Gold, +${statGained} ${statKey.toUpperCase()}`,
      xpEarned: xpGained,
      goldEarned: goldGained,
      gemsEarned: gemsGained,
      statGains: { stat: statKey, amount: statGained },
      metadata: { taskId: task._id, difficulty: task.difficulty },
    });

    if (progressionResult.leveledUp) {
      await ActivityLog.create({
        user: user._id,
        type: 'LEVEL_UP',
        title: `LEVEL UP! Reached Level ${progressionResult.newLevel}!`,
        details: `Unlocked title "${progressionResult.newTitle}" and received +${progressionResult.bonusGold} Bonus Gold!`,
        xpEarned: 0,
        goldEarned: progressionResult.bonusGold,
        gemsEarned: 0,
      });
    }

    res.json({
      success: true,
      message: progressionResult.leveledUp
        ? `VICTORY! Level Up to Level ${progressionResult.newLevel}!`
        : `Quest Completed! +${xpGained} XP, +${goldGained} Gold`,
      task,
      character: user.character,
      streak: user.streak,
      rewards: {
        xpGained,
        goldGained,
        gemsGained,
        statGained: { stat: statKey, amount: statGained },
        streakBonusApplied: streakMult > 1.0,
      },
      levelUp: {
        occurred: progressionResult.leveledUp,
        newLevel: progressionResult.newLevel,
        newTitle: progressionResult.newTitle,
        bonusGold: progressionResult.bonusGold,
        levelsGained: progressionResult.levelUps,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger a habit interaction (Positive grants XP/Gold, Negative deals damage)
// @route   POST /api/tasks/:id/habit
// @access  Private
const triggerHabit = async (req, res, next) => {
  try {
    const { action } = req.body; // 'PLUS' or 'MINUS'
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id, type: TASK_TYPES.HABIT });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }

    const user = await User.findById(req.user._id);
    const difficultyConfig = DIFFICULTY_REWARDS[task.difficulty] || DIFFICULTY_REWARDS.EASY;

    if (action === 'PLUS') {
      const streakMult = getStreakMultiplier(user.streak.current);
      const xpGained = Math.round((difficultyConfig.xp * 0.5) * streakMult);
      const goldGained = Math.round(difficultyConfig.gold * 0.5);
      const statGained = 1;

      const progressionResult = processProgression(
        user.character.level,
        user.character.currentXp,
        xpGained
      );

      const statKey = task.stat || ATTRIBUTES.INTELLECT;
      user.character.attributes[statKey] = (user.character.attributes[statKey] || 10) + statGained;
      user.character.currentXp = progressionResult.newXp;
      user.character.totalXp += xpGained;
      user.character.gold += goldGained + progressionResult.bonusGold;

      if (progressionResult.leveledUp) {
        user.character.level = progressionResult.newLevel;
        user.character.title = progressionResult.newTitle;
        user.character.hp.max += 10 * progressionResult.levelUps;
        user.character.hp.current = user.character.hp.max;
      }

      task.positiveCount = (task.positiveCount || 0) + 1;
      task.streak = (task.streak || 0) + 1;
      task.history.push({
        date: new Date(),
        action: 'HABIT_PLUS',
        xpEarned: xpGained,
        goldEarned: goldGained,
      });

      await task.save();
      await user.save();

      await ActivityLog.create({
        user: user._id,
        type: 'HABIT_TRACKED',
        title: `Positive Habit: ${task.title}`,
        details: `Earned +${xpGained} XP, +${goldGained} Gold, +1 ${statKey.toUpperCase()}`,
        xpEarned: xpGained,
        goldEarned: goldGained,
      });

      return res.json({
        success: true,
        message: `Habit reinforced! +${xpGained} XP, +${goldGained} Gold`,
        action: 'PLUS',
        task,
        character: user.character,
        levelUp: {
          occurred: progressionResult.leveledUp,
          newLevel: progressionResult.newLevel,
        },
      });
    } else if (action === 'MINUS') {
      const damageTaken = 10;
      user.character.hp.current = Math.max(0, user.character.hp.current - damageTaken);

      let faintOccurred = false;
      if (user.character.hp.current === 0) {
        // Player fainted from bad habits!
        faintOccurred = true;
        const goldLost = Math.floor(user.character.gold * 0.1); // Lose 10% gold
        user.character.gold = Math.max(0, user.character.gold - goldLost);
        user.character.hp.current = Math.floor(user.character.hp.max * 0.5); // Revive with 50% HP

        await ActivityLog.create({
          user: user._id,
          type: 'PENALTY_INCURRED',
          title: 'Defeated by Vices!',
          details: `Health reached 0! Lost ${goldLost} Gold and revived at 50% Health.`,
        });
      }

      task.negativeCount = (task.negativeCount || 0) + 1;
      task.history.push({
        date: new Date(),
        action: 'HABIT_MINUS',
        damageTaken,
      });

      await task.save();
      await user.save();

      await ActivityLog.create({
        user: user._id,
        type: 'HABIT_TRACKED',
        title: `Negative Habit: ${task.title}`,
        details: `Took ${damageTaken} damage! Current HP: ${user.character.hp.current}/${user.character.hp.max}`,
      });

      return res.json({
        success: true,
        message: faintOccurred
          ? 'You collapsed from exhaustion! Revived with half HP.'
          : `Ouch! Took ${damageTaken} damage from ${task.title}!`,
        action: 'MINUS',
        task,
        character: user.character,
        faintOccurred,
        damageTaken,
      });
    }

    return res.status(400).json({ success: false, message: "Action must be 'PLUS' or 'MINUS'" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  triggerHabit,
};
