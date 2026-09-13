const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['EQUIPMENT', 'POTION', 'THEME', 'BADGE', 'CUSTOM'],
      required: true,
    },
    slot: {
      type: String,
      enum: ['WEAPON', 'ARMOR', 'HELMET', 'ACCESSORY', 'POTION', 'THEME', 'BADGE', 'CUSTOM'],
      default: 'ACCESSORY',
    },
    costGold: {
      type: Number,
      default: 0,
      min: 0,
    },
    costGems: {
      type: Number,
      default: 0,
      min: 0,
    },
    statBonus: {
      intellect: { type: Number, default: 0 },
      strength: { type: Number, default: 0 },
      agility: { type: Number, default: 0 },
      vitality: { type: Number, default: 0 },
      wisdom: { type: Number, default: 0 },
      charisma: { type: Number, default: 0 },
    },
    healAmount: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    themeKey: {
      type: String,
    },
    badgeKey: {
      type: String,
    },
    isCustomReward: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ShopItem', shopItemSchema);
