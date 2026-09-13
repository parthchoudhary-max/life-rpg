const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { getXpForNextLevel } = require('../config/constants');

// @desc    Consume a potion from inventory to heal HP
// @route   POST /api/character/consume/:itemId
// @access  Private
const consumePotion = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    const potionIndex = user.character.inventory.findIndex(
      (item) => item.itemId === itemId && item.type === 'POTION'
    );

    if (potionIndex === -1) {
      return res.status(404).json({ success: false, message: 'Potion not found in inventory' });
    }

    const potion = user.character.inventory[potionIndex];

    if (potion.quantity <= 0) {
      return res.status(400).json({ success: false, message: 'No doses left of this potion!' });
    }

    if (user.character.hp.current >= user.character.hp.max) {
      return res.status(400).json({ success: false, message: 'Your Health is already at maximum!' });
    }

    const healAmount = potion.healAmount || 25;
    const oldHp = user.character.hp.current;
    user.character.hp.current = Math.min(user.character.hp.max, oldHp + healAmount);
    const actualHealed = user.character.hp.current - oldHp;

    potion.quantity -= 1;
    if (potion.quantity <= 0) {
      user.character.inventory.splice(potionIndex, 1);
    }

    await user.save();

    await ActivityLog.create({
      user: user._id,
      type: 'POTION_CONSUMED',
      title: `Consumed ${potion.name}`,
      details: `Restored +${actualHealed} HP (Now ${user.character.hp.current}/${user.character.hp.max})`,
    });

    res.json({
      success: true,
      message: `Drank ${potion.name}! Restored +${actualHealed} HP!`,
      hp: user.character.hp,
      character: user.character,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed character attributes with equipment bonuses
// @route   GET /api/character/stats
// @access  Private
const getCharacterStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compute effective attributes including equipped gear bonuses
    const baseAttrs = { ...user.character.attributes.toObject() };
    const gearBonuses = {
      intellect: 0,
      strength: 0,
      agility: 0,
      vitality: 0,
      wisdom: 0,
      charisma: 0,
    };

    user.character.inventory.forEach((item) => {
      if (item.equipped && item.statBonus) {
        Object.keys(gearBonuses).forEach((stat) => {
          if (item.statBonus[stat]) {
            gearBonuses[stat] += item.statBonus[stat];
          }
        });
      }
    });

    const effectiveAttrs = {};
    Object.keys(baseAttrs).forEach((stat) => {
      effectiveAttrs[stat] = (baseAttrs[stat] || 10) + (gearBonuses[stat] || 0);
    });

    const nextLevelXp = getXpForNextLevel(user.character.level);
    const xpPercent = Math.min(100, Math.round((user.character.currentXp / nextLevelXp) * 100));

    res.json({
      success: true,
      character: user.character,
      attributes: {
        base: baseAttrs,
        gearBonuses,
        effective: effectiveAttrs,
      },
      progression: {
        currentLevel: user.character.level,
        currentXp: user.character.currentXp,
        nextLevelXp,
        xpPercent,
        totalXp: user.character.totalXp,
      },
      streak: user.streak,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  consumePotion,
  getCharacterStats,
};
