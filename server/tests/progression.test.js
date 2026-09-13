const test = require('node:test');
const assert = require('node:assert');
const {
  getXpForNextLevel,
  processProgression,
  updateStreak,
  getStreakMultiplier,
  getTitleForLevel,
} = require('../src/config/constants');

test('Progression Engine - Non-linear XP Requirements', async (t) => {
  await t.test('calculates correct non-linear XP for level 1 to 5', () => {
    assert.strictEqual(getXpForNextLevel(1), 100);
    assert.strictEqual(getXpForNextLevel(2), 303);
    assert.strictEqual(getXpForNextLevel(3), 579);
    assert.strictEqual(getXpForNextLevel(4), 918);
    assert.strictEqual(getXpForNextLevel(5), 1313);
  });

  await t.test('handles edge case for level <= 0 gracefully', () => {
    assert.strictEqual(getXpForNextLevel(0), 100);
    assert.strictEqual(getXpForNextLevel(-5), 100);
  });
});

test('Progression Engine - Level Up Processing', async (t) => {
  await t.test('keeps level if XP is below requirement', () => {
    const result = processProgression(1, 0, 50);
    assert.strictEqual(result.newLevel, 1);
    assert.strictEqual(result.newXp, 50);
    assert.strictEqual(result.leveledUp, false);
    assert.strictEqual(result.levelUps, 0);
    assert.strictEqual(result.bonusGold, 0);
  });

  await t.test('triggers level up when XP threshold is met', () => {
    const result = processProgression(1, 0, 100);
    assert.strictEqual(result.newLevel, 2);
    assert.strictEqual(result.newXp, 0);
    assert.strictEqual(result.leveledUp, true);
    assert.strictEqual(result.levelUps, 1);
    assert.strictEqual(result.bonusGold, 50); // 2 * 25
  });

  await t.test('handles leftover XP correctly after leveling up', () => {
    const result = processProgression(1, 0, 125);
    assert.strictEqual(result.newLevel, 2);
    assert.strictEqual(result.newXp, 25);
    assert.strictEqual(result.leveledUp, true);
  });

  await t.test('handles massive XP burst with multi-level-ups', () => {
    // Level 1 requires 100 XP -> Level 2
    // Level 2 requires 303 XP -> Level 3
    // Total for Level 3 = 403 XP. Earning 500 XP should reach Level 3 with 97 leftover XP.
    const result = processProgression(1, 0, 500);
    assert.strictEqual(result.newLevel, 3);
    assert.strictEqual(result.newXp, 97);
    assert.strictEqual(result.levelUps, 2);
    assert.strictEqual(result.leveledUp, true);
    assert.strictEqual(result.bonusGold, (2 * 25) + (3 * 25)); // 50 + 75 = 125
  });
});

test('Progression Engine - Streak Tracking Logic', async (t) => {
  await t.test('initializes streak on first activity', () => {
    const res = updateStreak(null, 0, 0);
    assert.strictEqual(res.currentStreak, 1);
    assert.strictEqual(res.longestStreak, 1);
    assert.strictEqual(res.isNewDay, true);
  });

  await t.test('does not increase streak for same-day activity', () => {
    const today = new Date();
    const res = updateStreak(today, 3, 5);
    assert.strictEqual(res.currentStreak, 3);
    assert.strictEqual(res.longestStreak, 5);
    assert.strictEqual(res.isNewDay, false);
  });

  await t.test('increments streak for consecutive day activity', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const res = updateStreak(yesterday, 3, 3);
    assert.strictEqual(res.currentStreak, 4);
    assert.strictEqual(res.longestStreak, 4);
    assert.strictEqual(res.isNewDay, true);
  });

  await t.test('resets streak to 1 when a day is missed', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const res = updateStreak(threeDaysAgo, 10, 10);
    assert.strictEqual(res.currentStreak, 1);
    assert.strictEqual(res.longestStreak, 10); // Longest streak preserved
    assert.strictEqual(res.isNewDay, true);
  });
});

test('Progression Engine - Streak Multipliers', async (t) => {
  await t.test('returns 1.0 for streak <= 1', () => {
    assert.strictEqual(getStreakMultiplier(0), 1.0);
    assert.strictEqual(getStreakMultiplier(1), 1.0);
  });

  await t.test('returns bonus for streaks > 1', () => {
    // 5 day streak = 1 + (4 * 0.05) = 1.20
    assert.strictEqual(Math.round(getStreakMultiplier(5) * 100) / 100, 1.2);
  });

  await t.test('caps bonus at +50% (1.5 max)', () => {
    assert.strictEqual(getStreakMultiplier(20), 1.5);
    assert.strictEqual(getStreakMultiplier(100), 1.5);
  });
});

test('Progression Engine - Title Unlocks', async (t) => {
  assert.strictEqual(getTitleForLevel(1), 'Novice Wanderer');
  assert.strictEqual(getTitleForLevel(3), 'Apprentice Adventurer');
  assert.strictEqual(getTitleForLevel(5), 'Dungeon Explorer');
  assert.strictEqual(getTitleForLevel(10), 'Hero of the Realm');
  assert.strictEqual(getTitleForLevel(20), 'Mythic Champion');
});
