require('dotenv').config();
const mongoose = require('mongoose');
const ShopItem = require('../models/ShopItem');
const { connectDB, disconnectDB } = require('../config/db');

const initialShopCatalog = [
  // Consumables / Potions
  {
    itemId: 'potion_minor_hp',
    name: 'Minor Health Potion',
    description: 'A crimson flask of soothing draught. Restores 25 Health Points.',
    category: 'POTION',
    slot: 'POTION',
    costGold: 20,
    costGems: 0,
    healAmount: 25,
    icon: 'FlaskConical',
  },
  {
    itemId: 'potion_major_hp',
    name: 'Greater Elixir of Vitality',
    description: 'An effervescent sapphire potion brewed by elders. Restores 60 Health Points.',
    category: 'POTION',
    slot: 'POTION',
    costGold: 45,
    costGems: 0,
    healAmount: 60,
    icon: 'Wine',
  },
  {
    itemId: 'potion_phoenix_tear',
    name: 'Phoenix Tear Draught',
    description: 'Mythical golden tears. Completely restores 100 Health Points.',
    category: 'POTION',
    slot: 'POTION',
    costGold: 90,
    costGems: 1,
    healAmount: 100,
    icon: 'Sparkles',
  },

  // Weapons
  {
    itemId: 'weapon_iron_sword',
    name: 'Iron Broadsword',
    description: 'A sturdy hand-forged steel blade. Slashes through procrastination.',
    category: 'EQUIPMENT',
    slot: 'WEAPON',
    costGold: 100,
    costGems: 0,
    statBonus: { strength: 6 },
    icon: 'Sword',
  },
  {
    itemId: 'weapon_arcane_staff',
    name: 'Staff of the Archmage',
    description: 'Carved from elder pine and tipped with mana quartz. Deepens cognitive focus.',
    category: 'EQUIPMENT',
    slot: 'WEAPON',
    costGold: 120,
    costGems: 0,
    statBonus: { intellect: 7, wisdom: 2 },
    icon: 'Wand',
  },
  {
    itemId: 'weapon_shadow_daggers',
    name: 'Twin Viper Daggers',
    description: 'Balanced obsidian blades. Facilitates lightning-fast task completion.',
    category: 'EQUIPMENT',
    slot: 'WEAPON',
    costGold: 110,
    costGems: 0,
    statBonus: { agility: 6, charisma: 2 },
    icon: 'Zap',
  },
  {
    itemId: 'weapon_sun_hammer',
    name: 'Sunforged War Hammer',
    description: 'A radiant hammer imbued with unwavering discipline.',
    category: 'EQUIPMENT',
    slot: 'WEAPON',
    costGold: 220,
    costGems: 2,
    statBonus: { strength: 10, vitality: 5 },
    icon: 'Hammer',
  },

  // Armor & Gear
  {
    itemId: 'armor_chainmail',
    name: 'Reinforced Chainmail',
    description: 'Interlocked steel rings guarding your fortitude against bad habits.',
    category: 'EQUIPMENT',
    slot: 'ARMOR',
    costGold: 95,
    costGems: 0,
    statBonus: { vitality: 6 },
    icon: 'Shield',
  },
  {
    itemId: 'armor_elven_cloak',
    name: 'Elven Forest Cloak',
    description: 'Woven with leaves and silken threads. Keeps you agile and focused.',
    category: 'EQUIPMENT',
    slot: 'ARMOR',
    costGold: 140,
    costGems: 0,
    statBonus: { agility: 5, wisdom: 4 },
    icon: 'Feather',
  },
  {
    itemId: 'accessory_polymath_ring',
    name: 'Ring of the Polymath',
    description: 'An intricate signet ring bestowing universal curiosity.',
    category: 'EQUIPMENT',
    slot: 'ACCESSORY',
    costGold: 180,
    costGems: 1,
    statBonus: { intellect: 5, wisdom: 5, charisma: 3 },
    icon: 'Crown',
  },

  // Themes
  {
    itemId: 'theme_dungeon_dark',
    name: 'Dungeon Crypt Theme',
    description: 'The classic 16-bit dark stone dungeon aesthetic.',
    category: 'THEME',
    slot: 'THEME',
    costGold: 0,
    costGems: 0,
    themeKey: 'dungeon-dark',
    icon: 'Palette',
  },
  {
    itemId: 'theme_gameboy_retro',
    name: 'GameBoy 1989 Theme',
    description: 'Nostalgic 4-shade greenish LCD phosphor styling.',
    category: 'THEME',
    slot: 'THEME',
    costGold: 120,
    costGems: 0,
    themeKey: 'gameboy-retro',
    icon: 'Gamepad2',
  },
  {
    itemId: 'theme_cyberpunk_neon',
    name: 'Cyberpunk Neon Theme',
    description: 'High-tech neon grid with glowing cyan and hot pink accents.',
    category: 'THEME',
    slot: 'THEME',
    costGold: 220,
    costGems: 2,
    themeKey: 'cyberpunk-neon',
    icon: 'Cpu',
  },
  {
    itemId: 'theme_molten_forge',
    name: 'Molten Forge Theme',
    description: 'Fiery magma embers and smoldering dark obsidian.',
    category: 'THEME',
    slot: 'THEME',
    costGold: 250,
    costGems: 3,
    themeKey: 'molten-forge',
    icon: 'Flame',
  },

  // Profile Badges
  {
    itemId: 'badge_novice',
    name: 'Novice Pioneer Badge',
    description: 'Granted to those who take the courageous first step into Life RPG.',
    category: 'BADGE',
    slot: 'BADGE',
    costGold: 0,
    costGems: 0,
    badgeKey: 'badge_novice',
    icon: 'Award',
  },
  {
    itemId: 'badge_streak_master',
    name: 'Eternal Flame Badge',
    description: 'Proof of unyielding daily consistency and heroic dedication.',
    category: 'BADGE',
    slot: 'BADGE',
    costGold: 150,
    costGems: 1,
    badgeKey: 'badge_streak_master',
    icon: 'Flame',
  },
  {
    itemId: 'badge_dragon_slayer',
    name: 'Wyrmslayer Crest',
    description: 'Given to legendary warriors who vanquished colossal deadlines.',
    category: 'BADGE',
    slot: 'BADGE',
    costGold: 300,
    costGems: 5,
    badgeKey: 'badge_dragon_slayer',
    icon: 'Trophy',
  },
];

const seedShopCatalog = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding initial 16-bit Shop Catalog...');

    for (const item of initialShopCatalog) {
      await ShopItem.findOneAndUpdate(
        { itemId: item.itemId },
        { ...item, isCustomReward: false },
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Seeded ${initialShopCatalog.length} shop items successfully!`);
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed shop items:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedShopCatalog();
}

module.exports = { initialShopCatalog, seedShopCatalog };
