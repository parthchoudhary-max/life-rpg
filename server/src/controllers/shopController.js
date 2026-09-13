const ShopItem = require('../models/ShopItem');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all available shop items & user custom rewards
// @route   GET /api/shop
// @access  Private
const getShopItems = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = {
      $or: [{ isCustomReward: false }, { isCustomReward: true, user: req.user._id }],
    };

    if (category) {
      query.category = category;
    }

    const items = await ShopItem.find(query).sort({ costGold: 1, costGems: 1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Purchase an item from the shop
// @route   POST /api/shop/purchase/:id
// @access  Private
const purchaseItem = async (req, res, next) => {
  try {
    const shopItem = await ShopItem.findById(req.params.id);
    if (!shopItem) {
      return res.status(404).json({ success: false, message: 'Item not found in shop catalog' });
    }

    // Check custom reward ownership
    if (shopItem.isCustomReward && String(shopItem.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You cannot purchase another adventurer’s custom reward' });
    }

    const user = await User.findById(req.user._id);

    // Check funds
    if (user.character.gold < shopItem.costGold) {
      return res.status(400).json({
        success: false,
        message: `Not enough Gold! You need ${shopItem.costGold} Gold, but only have ${user.character.gold}.`,
      });
    }

    if (user.character.gems < shopItem.costGems) {
      return res.status(400).json({
        success: false,
        message: `Not enough Gems! You need ${shopItem.costGems} Gems, but only have ${user.character.gems}.`,
      });
    }

    // Deduct currency
    user.character.gold -= shopItem.costGold;
    user.character.gems -= shopItem.costGems;

    // Handle Custom Real-Life Reward
    if (shopItem.isCustomReward) {
      await user.save();
      await ActivityLog.create({
        user: user._id,
        type: 'ITEM_PURCHASED',
        title: `Redeemed Reward: ${shopItem.name}!`,
        details: `Spent ${shopItem.costGold} Gold to claim real-world reward: ${shopItem.name}`,
        goldEarned: -shopItem.costGold,
      });

      return res.json({
        success: true,
        message: `Huzzah! You redeemed "${shopItem.name}"! Go enjoy your reward!`,
        character: user.character,
      });
    }

    // Check if item already in inventory
    const existingIndex = user.character.inventory.findIndex(
      (inv) => inv.itemId === shopItem.itemId
    );

    if (existingIndex > -1) {
      if (shopItem.category === 'POTION') {
        user.character.inventory[existingIndex].quantity += 1;
      } else {
        // Equipment/Theme/Badge cannot be duplicated
        return res.status(400).json({
          success: false,
          message: 'You already possess this unique item in your inventory!',
        });
      }
    } else {
      // Add new inventory item
      user.character.inventory.push({
        itemId: shopItem.itemId,
        name: shopItem.name,
        type: shopItem.category,
        slot: shopItem.slot,
        icon: shopItem.icon,
        description: shopItem.description,
        statBonus: shopItem.statBonus,
        healAmount: shopItem.healAmount,
        quantity: 1,
        equipped: false,
      });
    }

    await user.save();

    await ActivityLog.create({
      user: user._id,
      type: 'ITEM_PURCHASED',
      title: `Bought: ${shopItem.name}`,
      details: `Acquired for ${shopItem.costGold} Gold${shopItem.costGems > 0 ? ` and ${shopItem.costGems} Gems` : ''}`,
      goldEarned: -shopItem.costGold,
    });

    res.json({
      success: true,
      message: `Successfully purchased ${shopItem.name}!`,
      character: user.character,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Equip an item, theme, or badge from inventory
// @route   POST /api/shop/equip/:itemId
// @access  Private
const equipItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const user = await User.findById(req.user._id);

    const targetItem = user.character.inventory.find((inv) => inv.itemId === itemId);
    if (!targetItem) {
      return res.status(404).json({ success: false, message: 'Item not found in your inventory' });
    }

    if (targetItem.type === 'THEME') {
      user.character.equippedTheme = targetItem.itemId;
      targetItem.equipped = true;
      user.character.inventory.forEach((item) => {
        if (item.type === 'THEME' && item.itemId !== itemId) {
          item.equipped = false;
        }
      });
    } else if (targetItem.type === 'BADGE') {
      user.character.equippedBadge = targetItem.itemId;
      targetItem.equipped = true;
      user.character.inventory.forEach((item) => {
        if (item.type === 'BADGE' && item.itemId !== itemId) {
          item.equipped = false;
        }
      });
    } else if (targetItem.type === 'EQUIPMENT') {
      // Toggle equip: if already equipped, unequip; otherwise unequip current slot item and equip this
      const isCurrentlyEquipped = targetItem.equipped;

      // Unequip any item in the same slot
      user.character.inventory.forEach((item) => {
        if (item.slot === targetItem.slot) {
          item.equipped = false;
        }
      });

      targetItem.equipped = !isCurrentlyEquipped;
    }

    await user.save();

    await ActivityLog.create({
      user: user._id,
      type: 'ITEM_EQUIPPED',
      title: `Equipped ${targetItem.name}`,
      details: `Active in ${targetItem.slot} slot`,
    });

    res.json({
      success: true,
      message: `${targetItem.name} ${targetItem.equipped ? 'equipped' : 'unequipped'}!`,
      character: user.character,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom real-life reward (e.g., Cheat Meal, 1hr gaming)
// @route   POST /api/shop/custom-reward
// @access  Private
const createCustomReward = async (req, res, next) => {
  try {
    const { name, description, costGold, icon } = req.body;

    if (!name || !costGold) {
      return res.status(400).json({
        success: false,
        message: 'Reward name and Gold cost are required',
      });
    }

    const customReward = new ShopItem({
      itemId: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      description: description || 'A real-life reward for reaching your goals!',
      category: 'CUSTOM',
      slot: 'CUSTOM',
      costGold: Number(costGold),
      costGems: 0,
      icon: icon || 'Gift',
      isCustomReward: true,
      user: req.user._id,
    });

    await customReward.save();

    res.status(201).json({
      success: true,
      message: 'Custom reward added to the merchant ledger!',
      reward: customReward,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a custom reward
// @route   DELETE /api/shop/custom-reward/:id
// @access  Private
const deleteCustomReward = async (req, res, next) => {
  try {
    const reward = await ShopItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
      isCustomReward: true,
    });

    if (!reward) {
      return res.status(404).json({ success: false, message: 'Custom reward not found' });
    }

    res.json({
      success: true,
      message: 'Custom reward removed from merchant shelf',
      rewardId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShopItems,
  purchaseItem,
  equipItem,
  createCustomReward,
  deleteCustomReward,
};
