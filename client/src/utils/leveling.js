export const getXpForNextLevel = (level) => {
  if (level < 1) level = 1;
  return Math.floor(100 * Math.pow(level, 1.6));
};

export const CHARACTER_CLASSES = {
  WARRIOR: {
    id: 'WARRIOR',
    name: 'Warrior',
    primaryStat: 'strength',
    description: 'Disciplined fighter. Excels in physical fitness and arduous endurance quests.',
  },
  MAGE: {
    id: 'MAGE',
    name: 'Mage',
    primaryStat: 'intellect',
    description: 'Master of arcane knowledge. Earns extra intellect from coding, research, and reading.',
  },
  ROGUE: {
    id: 'ROGUE',
    name: 'Rogue',
    primaryStat: 'agility',
    description: 'Swift and agile shadow. Masters rapid chores, daily routines, and precision tasks.',
  },
  PALADIN: {
    id: 'PALADIN',
    name: 'Paladin',
    primaryStat: 'vitality',
    description: 'Holy guardian of habits. High survivability and boosted health regeneration.',
  },
  HEALER: {
    id: 'HEALER',
    name: 'Healer',
    primaryStat: 'wisdom',
    description: 'Calm and reflective mind. Gains deep insight from meditation, wellness, and journaling.',
  },
  ALCHEMIST: {
    id: 'ALCHEMIST',
    name: 'Alchemist',
    primaryStat: 'charisma',
    description: 'Transmuter of energy and currency. Receives higher gold bonuses and shop discounts.',
  },
};


export const calculateLevelProgress = (level, currentXp) => {
  const nextXp = getXpForNextLevel(level);
  const percentage = Math.min(100, Math.max(0, Math.round((currentXp / nextXp) * 100)));
  return {
    nextXp,
    currentXp,
    percentage,
  };
};

export const STAT_CONFIG = {
  intellect: {
    label: 'Intellect',
    short: 'INT',
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.15)',
    border: '#3b82f6',
    icon: 'Brain',
    description: 'Coding, studying, research, deep work',
  },
  strength: {
    label: 'Strength',
    short: 'STR',
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.15)',
    border: '#ef4444',
    icon: 'Dumbbell',
    description: 'Workouts, fitness, sports, lifting',
  },
  agility: {
    label: 'Agility',
    short: 'AGI',
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.15)',
    border: '#22c55e',
    icon: 'Zap',
    description: 'Chores, cleaning, rapid errands, speed',
  },
  vitality: {
    label: 'Vitality',
    short: 'VIT',
    color: '#fb923c',
    bg: 'rgba(251, 146, 60, 0.15)',
    border: '#f97316',
    icon: 'Heart',
    description: 'Sleep, nutrition, hydration, wellness',
  },
  wisdom: {
    label: 'Wisdom',
    short: 'WIS',
    color: '#c084fc',
    bg: 'rgba(192, 132, 252, 0.15)',
    border: '#a855f7',
    icon: 'BookOpen',
    description: 'Meditation, journaling, budgeting, planning',
  },
  charisma: {
    label: 'Charisma',
    short: 'CHA',
    color: '#f472b6',
    bg: 'rgba(244, 114, 182, 0.15)',
    border: '#ec4899',
    icon: 'Users',
    description: 'Socializing, networking, speaking, community',
  },
};

export const DIFFICULTY_CONFIG = {
  TRIVIAL: { label: 'Trivial', color: '#94a3b8', xp: 15, gold: 5 },
  EASY: { label: 'Easy', color: '#4ade80', xp: 35, gold: 12 },
  MEDIUM: { label: 'Medium', color: '#38bdf8', xp: 75, gold: 25 },
  HARD: { label: 'Hard', color: '#fbbf24', xp: 150, gold: 60 },
  EPIC: { label: 'Epic', color: '#c084fc', xp: 350, gold: 150, gems: 1 },
};
