const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { CHARACTER_CLASSES, ATTRIBUTES, getTitleForLevel } = require('../config/constants');

const inventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['EQUIPMENT', 'POTION', 'THEME', 'BADGE', 'REWARD'],
    required: true,
  },
  slot: {
    type: String,
    enum: ['WEAPON', 'ARMOR', 'HELMET', 'ACCESSORY', 'POTION', 'THEME', 'BADGE', 'CUSTOM'],
    default: 'ACCESSORY',
  },
  icon: { type: String, default: 'Package' },
  description: { type: String, default: '' },
  statBonus: {
    intellect: { type: Number, default: 0 },
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    vitality: { type: Number, default: 0 },
    wisdom: { type: Number, default: 0 },
    charisma: { type: Number, default: 0 },
  },
  healAmount: { type: Number, default: 0 },
  quantity: { type: Number, default: 1, min: 0 },
  equipped: { type: Boolean, default: false },
  purchasedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not expose password by default
    },
    character: {
      name: { type: String, default: 'Hero' },
      class: {
        type: String,
        enum: Object.keys(CHARACTER_CLASSES),
        default: 'WARRIOR',
      },
      avatar: { type: String, default: 'warrior-1' },
      title: { type: String, default: 'Novice Wanderer' },
      level: { type: Number, default: 1, min: 1 },
      currentXp: { type: Number, default: 0, min: 0 },
      totalXp: { type: Number, default: 0, min: 0 },
      hp: {
        current: { type: Number, default: 50, min: 0 },
        max: { type: Number, default: 50, min: 1 },
      },
      gold: { type: Number, default: 50, min: 0 },
      gems: { type: Number, default: 5, min: 0 },
      attributes: {
        intellect: { type: Number, default: 10, min: 1 },
        strength: { type: Number, default: 10, min: 1 },
        agility: { type: Number, default: 10, min: 1 },
        vitality: { type: Number, default: 10, min: 1 },
        wisdom: { type: Number, default: 10, min: 1 },
        charisma: { type: Number, default: 10, min: 1 },
      },
      equippedTheme: { type: String, default: 'dungeon-dark' },
      equippedBadge: { type: String, default: 'badge_novice' },
      inventory: [inventoryItemSchema],
    },
    streak: {
      current: { type: Number, default: 1, min: 0 },
      longest: { type: Number, default: 1, min: 0 },
      lastActiveDate: { type: Date, default: Date.now },
    },
    settings: {
      soundEnabled: { type: Boolean, default: true },
      soundVolume: { type: Number, default: 0.5, min: 0, max: 1 },
      scanlineEffect: { type: Boolean, default: true },
      crtEffect: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Password verification method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure character titles match level
userSchema.methods.syncTitle = function () {
  this.character.title = getTitleForLevel(this.character.level);
};

module.exports = mongoose.model('User', userSchema);
