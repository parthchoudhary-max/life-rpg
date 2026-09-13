/**
 * Life RPG - Core Progression and Game Constants
 */

// Core Character Attributes
const ATTRIBUTES = {
  INTELLECT: 'intellect',
  STRENGTH: 'strength',
  AGILITY: 'agility',
  VITALITY: 'vitality',
  WISDOM: 'wisdom',
  CHARISMA: 'charisma',
};

// Character Classes & Starting Bonuses
const CHARACTER_CLASSES = {
  WARRIOR: {
    id: 'WARRIOR',
    name: 'Warrior',
    primaryStat: ATTRIBUTES.STRENGTH,
    description: 'Disciplined fighter. Excels in physical fitness and arduous endurance quests.',
    statBonus: { [ATTRIBUTES.STRENGTH]: 5, [ATTRIBUTES.VITALITY]: 3 },
    icon: 'Shield',
  },
  MAGE: {
    id: 'MAGE',
    name: 'Mage',
    primaryStat: ATTRIBUTES.INTELLECT,
    description: 'Master of arcane knowledge. Earns extra intellect from coding, research, and reading.',
    statBonus: { [ATTRIBUTES.INTELLECT]: 5, [ATTRIBUTES.WISDOM]: 3 },
    icon: 'Wand',
  },
  ROGUE: {
    id: 'ROGUE',
    name: 'Rogue',
    primaryStat: ATTRIBUTES.AGILITY,
    description: 'Swift and agile shadow. Masters rapid chores, daily routines, and precision tasks.',
    statBonus: { [ATTRIBUTES.AGILITY]: 5, [ATTRIBUTES.CHARISMA]: 3 },
    icon: 'Zap',
  },
  PALADIN: {
    id: 'PALADIN',
    name: 'Paladin',
    primaryStat: ATTRIBUTES.VITALITY,
    description: 'Holy guardian of habits. High survivability and boosted health regeneration.',
    statBonus: { [ATTRIBUTES.VITALITY]: 5, [ATTRIBUTES.STRENGTH]: 3 },
    icon: 'Heart',
  },
  HEALER: {
    id: 'HEALER',
    name: 'Healer',
    primaryStat: ATTRIBUTES.WISDOM,
    description: 'Calm and reflective mind. Gains deep insight from meditation, wellness, and journaling.',
    statBonus: { [ATTRIBUTES.WISDOM]: 5, [ATTRIBUTES.VITALITY]: 3 },
    icon: 'Feather',
  },
  ALCHEMIST: {
    id: 'ALCHEMIST',
    name: 'Alchemist',
    primaryStat: ATTRIBUTES.CHARISMA,
    description: 'Transmuter of energy and currency. Receives higher gold bonuses and shop discounts.',
    statBonus: { [ATTRIBUTES.CHARISMA]: 5, [ATTRIBUTES.INTELLECT]: 3 },
    icon: 'FlaskConical',
  },
};

// Task Difficulties & Rewards
const DIFFICULTY_REWARDS = {
  TRIVIAL: {
    xp: 15,
    gold: 5,
    gems: 0,
    statPoints: 1,
    label: 'Trivial',
    color: '#94a3b8',
  },
  EASY: {
    xp: 35,
    gold: 12,
    gems: 0,
    statPoints: 2,
    label: 'Easy',
    color: '#4ade80',
  },
  MEDIUM: {
    xp: 75,
    gold: 25,
    gems: 0,
    statPoints: 3,
    label: 'Medium',
    color: '#38bdf8',
  },
  HARD: {
    xp: 150,
    gold: 60,
    gems: 1,
    statPoints: 5,
    label: 'Hard',
    color: '#fbbf24',
  },
  EPIC: {
    xp: 350,
    gold: 150,
    gems: 2,
    statPoints: 10,
    label: 'Epic',
    color: '#c084fc',
  },
};

// Task Types
const TASK_TYPES = {
  TODO: 'TODO',       // One-off Quests
  DAILY: 'DAILY',     // Daily Recurring Quests (resets daily)
  HABIT: 'HABIT',     // Continuous Habits (+ / - buttons)
};

// Non-linear XP Curve Formula
// Level 1 -> 2: 100 XP
// Level 2 -> 3: 303 XP
// Level 3 -> 4: 579 XP
// Level 4 -> 5: 919 XP
// Level 5 -> 6: 1313 XP
const getXpForNextLevel = (level) => {
  if (level < 1) level = 1;
  return Math.floor(100 * Math.pow(level, 1.6));
};

// Title Progression by Level
const getTitleForLevel = (level) => {
  if (level >= 30) return 'God of Productivity';
  if (level >= 25) return 'Ascended Legend';
  if (level >= 20) return 'Mythic Champion';
  if (level >= 15) return 'Dungeon Overlord';
  if (level >= 10) return 'Hero of the Realm';
  if (level >= 7) return 'Veteran Slayer';
  if (level >= 5) return 'Dungeon Explorer';
  if (level >= 3) return 'Apprentice Adventurer';
  return 'Novice Wanderer';
};

// Calculate Level-Up and leftover XP
const processProgression = (currentLevel, currentXp, xpGained) => {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let levelUps = 0;
  let bonusGold = 0;

  while (xp >= getXpForNextLevel(level)) {
    xp -= getXpForNextLevel(level);
    level += 1;
    levelUps += 1;
    bonusGold += level * 25; // Bonus gold for leveling up
  }

  return {
    newLevel: level,
    newXp: xp,
    levelUps,
    bonusGold,
    leveledUp: levelUps > 0,
    newTitle: getTitleForLevel(level),
  };
};

// Streak calculation logic
const updateStreak = (lastActiveDate, currentStreak, longestStreak) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak || 0),
      lastActiveDate: now,
      isNewDay: true,
    };
  }

  const last = new Date(lastActiveDate);
  const lastActiveDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const diffTime = today.getTime() - lastActiveDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Already active today
    return {
      currentStreak,
      longestStreak,
      lastActiveDate: now,
      isNewDay: false,
    };
  } else if (diffDays === 1) {
    // Consecutive active day!
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak || 0),
      lastActiveDate: now,
      isNewDay: true,
    };
  } else {
    // Streak broken (> 1 day missed)
    return {
      currentStreak: 1,
      longestStreak: Math.max(currentStreak, longestStreak || 0),
      lastActiveDate: now,
      isNewDay: true,
    };
  }
};

// Streak XP Multiplier (Up to +50% bonus)
const getStreakMultiplier = (streak) => {
  if (!streak || streak <= 1) return 1.0;
  const bonus = Math.min(0.5, (streak - 1) * 0.05);
  return 1.0 + bonus;
};

module.exports = {
  ATTRIBUTES,
  CHARACTER_CLASSES,
  DIFFICULTY_REWARDS,
  TASK_TYPES,
  getXpForNextLevel,
  getTitleForLevel,
  processProgression,
  updateStreak,
  getStreakMultiplier,
};
