const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { CHARACTER_CLASSES, updateStreak, getTitleForLevel } = require('../config/constants');

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_retro_life_rpg_key_2026!',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register new user & character
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { username, email, password, characterName, characterClass, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email.toLowerCase()
          ? 'An account with this email already exists'
          : 'This username is already taken by another adventurer',
      });
    }

    const selectedClass = CHARACTER_CLASSES[characterClass] || CHARACTER_CLASSES.WARRIOR;

    // Base attributes with class bonus
    const baseAttributes = {
      intellect: 10 + (selectedClass.statBonus.intellect || 0),
      strength: 10 + (selectedClass.statBonus.strength || 0),
      agility: 10 + (selectedClass.statBonus.agility || 0),
      vitality: 10 + (selectedClass.statBonus.vitality || 0),
      wisdom: 10 + (selectedClass.statBonus.wisdom || 0),
      charisma: 10 + (selectedClass.statBonus.charisma || 0),
    };

    // Create user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      character: {
        name: characterName || username,
        class: selectedClass.id,
        avatar: avatar || 'warrior-1',
        title: 'Novice Wanderer',
        level: 1,
        currentXp: 0,
        totalXp: 0,
        hp: { current: 50, max: 50 },
        gold: 50, // Starter coin purse
        gems: 5,  // Starter gems
        attributes: baseAttributes,
        inventory: [
          {
            itemId: 'potion_minor_hp',
            name: 'Minor Health Potion',
            type: 'POTION',
            slot: 'POTION',
            icon: 'FlaskConical',
            description: 'Restores 25 Health Points when mundane habits exhaust you.',
            healAmount: 25,
            quantity: 2,
            equipped: false,
          },
          {
            itemId: 'wooden_sword',
            name: 'Novice Wooden Sword',
            type: 'EQUIPMENT',
            slot: 'WEAPON',
            icon: 'Sword',
            description: 'A humble blade to begin your questing journey.',
            statBonus: { strength: 2 },
            quantity: 1,
            equipped: true,
          },
        ],
      },
      streak: {
        current: 1,
        longest: 1,
        lastActiveDate: new Date(),
      },
    });

    await newUser.save();

    // Create initial welcome log
    await ActivityLog.create({
      user: newUser._id,
      type: 'LEVEL_UP',
      title: 'Journey Begun!',
      details: `Adventurer ${newUser.character.name} entered the realm as a Level 1 ${selectedClass.name}.`,
      xpEarned: 0,
      goldEarned: 50,
      gemsEarned: 5,
    });

    const token = generateToken(newUser._id);

    // Return sanitized user object
    const userJson = newUser.toObject();
    delete userJson.password;

    res.status(201).json({
      success: true,
      message: 'Welcome to the Realm of Life RPG!',
      token,
      user: userJson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username/email and password',
      });
    }

    // Check by username or email
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { username: loginIdentifier.toLowerCase() },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No adventurer found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect passphrase.',
      });
    }

    // Check & update login streak
    const streakResult = updateStreak(
      user.streak.lastActiveDate,
      user.streak.current,
      user.streak.longest
    );

    user.streak.current = streakResult.currentStreak;
    user.streak.longest = streakResult.longestStreak;
    user.streak.lastActiveDate = streakResult.lastActiveDate;

    // Check title sync
    user.syncTitle();
    await user.save();

    const token = generateToken(user._id);

    const userJson = user.toObject();
    delete userJson.password;

    res.json({
      success: true,
      message: `Welcome back, ${user.character.name}!`,
      token,
      user: userJson,
      streakUpdated: streakResult.isNewDay,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile & character state
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check title sync
    user.syncTitle();
    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update character settings (sound, scanlines, crt)
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    const { soundEnabled, soundVolume, scanlineEffect, crtEffect } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (soundEnabled !== undefined) user.settings.soundEnabled = soundEnabled;
    if (soundVolume !== undefined) user.settings.soundVolume = soundVolume;
    if (scanlineEffect !== undefined) user.settings.scanlineEffect = scanlineEffect;
    if (crtEffect !== undefined) user.settings.crtEffect = crtEffect;

    await user.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateSettings,
};
