# ⚔️ Life RPG - 16-Bit Gamified Productivity Engine

> **Translate mundane real-world tasks into a virtual 16-bit RPG progression system to solve the "delayed gratification" problem of standard productivity tools.**

![Life RPG Theme](https://img.shields.io/badge/Theme-16--Bit%20Dungeon%20Crawler-purple?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 📖 Table of Contents
1. [The Vision & Core Problem Solved](#-the-vision--core-problem-solved)
2. [Key Systems & Features](#-key-systems--features)
3. [Game Progression Mechanics](#-game-progression-mechanics)
4. [Tech Stack & Architecture](#-tech-stack--architecture)
5. [Complete File Structure](#-complete-file-structure)
6. [Environment Variables](#-environment-variables)
7. [Installation & Quickstart Guide](#-installation--quickstart-guide)
8. [REST API Documentation](#-rest-api-documentation)
9. [Audio Synthesis & Accessibility](#-audio-synthesis--accessibility)
10. [Automated Testing](#-automated-testing)

---

## 🎯 The Vision & Core Problem Solved

Standard to-do list applications and habit trackers suffer from the **delayed gratification problem**: you clean your desk, study algorithms for two hours, or hit the gym, and all you get is a muted grey checkmark. The brain receives minimal dopamine, leading to abandonment.

**Life RPG** bridges this psychological barrier by translating real-life actions into instantaneous virtual feedback:
- **Instant Celebrations**: Checking off a task triggers an 8-bit fanfare, floating combat text (`+75 XP`, `+25 Gold`), and a particle explosion.
- **Discipline-Specific Stats**: Every task levels up a specific RPG attribute (e.g., Coding increments `Intellect`, Workouts level up `Strength`, Chores boost `Agility`).
- **Tangible Economy**: Earn in-game Gold and Gems to buy weapons, armor, 16-bit retro UI themes, or redeem custom guilt-free real-world rewards (e.g., "1 Hour Video Games", "Cheat Meal").
- **Consequences**: Bad habits and missed routines drain Health Points (HP), threatening defeat and loss of gold!

---

## 🌟 Key Systems & Features

### 1. Authentication & Security
- Secure JWT-based authentication with bcrypt-hashed passwords.
- Strict data isolation ensuring adventurers can only query, modify, or delete their own tasks and character profiles.
- Automatic session renewal with 401 interceptors.

### 2. Database Persistence
- Robust MongoDB schemas via Mongoose for **Users**, **Tasks**, **ShopItems**, and **ActivityLogs**.
- **Historical Activity Ledger**: All completed quests, level-ups, stat gains, purchases, and penalties are persistently logged for auditing and timeline analytics.
- Strictly avoids relying on ephemeral browser localStorage for primary game state.

### 3. Non-Linear Progression Engine
- Smooth, exponential XP curve where each level requires more effort than the last:
  $$\text{XP Required} = \lfloor 100 \times \text{Level}^{1.6} \rfloor$$
- Multi-level-up detection handles massive XP bounties gracefully.
- Milestone titles unlock as you level up (e.g. *Novice Wanderer* $\to$ *Dungeon Explorer* $\to$ *Mythic Champion*).
- Full HP restoration and bonus gold upon each level-up.

### 4. Attributes & Streaks
- **6 Core Disciplines**:
  - 🧠 **Intellect (INT)**: Coding, studying, technical reading, research.
  - 🏋️ **Strength (STR)**: Lifting, cardio, physical fitness, sports.
  - ⚡ **Agility (AGI)**: Rapid chores, house cleaning, errands, quick sprints.
  - ❤️ **Vitality (VIT)**: Sleep, nutrition, hydration, wellness.
  - 📖 **Wisdom (WIS)**: Meditation, reflection, journaling, budgeting.
  - 👥 **Charisma (CHA)**: Socializing, networking, public speaking, team rituals.
- **Momentum Multiplier**: Consecutive days of activity increase your daily streak multiplier, granting up to **+50% bonus XP and Gold**.

### 5. Economy & Custom Rewards
- **Merchant Shop**: Buy Weapons, Armor, Health Potions, Retro Themes, and Profile Badges.
- **Equip System**: Equipping swords and armor adds active stat bonuses directly to your character sheet.
- **Custom Real-Life Rewards**: Create your own custom reward items in the shop (e.g., "1 Hour of Steam Gaming" for 40 Gold) so your in-game discipline directly pays for your real-world leisure.

### 6. Tactile 16-Bit UI/UX & Web Audio Synthesis
- Authentic 16-bit dungeon crawler aesthetic with Google Font `Press Start 2P`, retro beveled buttons, CRT scanlines overlay, and custom pixel scrollbars.
- **Zero-Dependency Audio Engine**: Real-time chiptune 8-bit sound effects (coin ding, quest complete, victory fanfare, potion gulp, damage hit) synthesized using the HTML5 **Web Audio API** (no missing audio assets or 404 network errors).
- **Spring Animations**: Framer Motion spring physics on modals, tab transitions, and floating combat text.
- **Full Keyboard Navigation**: Fully navigable with `Tab`, `Enter`, and `Space`. Global shortcuts (`N` for new quest, `I` for inventory, `M` to toggle mute).
- **Latency Masking**: Optimistic UI updates with skeleton loaders so the app feels instantaneous.

---

## 📈 Game Progression Mechanics

### XP Difficulty Table
| Difficulty | XP Awarded | Gold Bounty | Gems | Stat Gain |
|---|---|---|---|---|
| **Trivial** | 15 XP | 5 Gold | 0 | +1 |
| **Easy** | 35 XP | 12 Gold | 0 | +2 |
| **Medium** | 75 XP | 25 Gold | 0 | +3 |
| **Hard** | 150 XP | 60 Gold | 1 Gem | +5 |
| **Epic** | 350 XP | 150 Gold | 2 Gems | +10 |

### Exponential Level Curve Sample
- **Level 1 $\to$ 2**: 100 XP
- **Level 2 $\to$ 3**: 303 XP
- **Level 3 $\to$ 4**: 579 XP
- **Level 4 $\to$ 5**: 918 XP
- **Level 5 $\to$ 6**: 1,313 XP
- **Level 10 $\to$ 11**: 3,981 XP

---

## 🛠 Tech Stack & Architecture

```
┌────────────────────────────────────────────────────────┐
│             React 18 + Vite (Client)                   │
│   Tailwind CSS  •  Framer Motion  •  Canvas Confetti   │
│   Web Audio API Synthesizer  •  Lucide 16-Bit Icons    │
└──────────────────────────┬─────────────────────────────┘
                           │ REST API (Bearer JWT)
┌──────────────────────────▼─────────────────────────────┐
│             Express.js Server (Backend)                │
│   JWT Auth Middleware  •  Helmet  •  CORS  •  Morgan   │
│   Progression Engine  •  Streak Calculation Core       │
└──────────────────────────┬─────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼─────────────────────────────┐
│               MongoDB Database                         │
│   Users & Character Profile  •  Tasks & Habits         │
│   Shop Catalog  •  Persistent Activity Ledger Logs     │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Complete File Structure

```
epic-turing/
├── package.json                         # Monorepo root orchestration scripts
├── .gitignore                           # Git ignore rules
├── README.md                            # Complete documentation & guide
│
├── server/                              # Express & MongoDB API
│   ├── package.json
│   ├── .env.example                     # Environment template
│   ├── .env                             # Local development environment
│   ├── src/
│   │   ├── index.js                     # Express entry point, middleware, auto-seed
│   │   ├── config/
│   │   │   ├── constants.js             # Progression formulas, classes, stats
│   │   │   └── db.js                    # Resilient Mongoose connection + in-memory fallback
│   │   ├── models/
│   │   │   ├── User.js                  # User, character attributes, inventory schema
│   │   │   ├── Task.js                  # Quest, daily ritual, and habit schema
│   │   │   ├── ShopItem.js              # Equipment, potions, themes, and custom rewards
│   │   │   └── ActivityLog.js           # Persistent audit and historical logs
│   │   ├── middleware/
│   │   │   ├── auth.js                  # JWT verification & user isolation
│   │   │   ├── errorHandler.js          # Centralized error handler
│   │   │   └── validate.js              # Express-validator middleware
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register, login, session, streak update
│   │   │   ├── taskController.js        # CRUD, complete quest, habit +/-, level-up
│   │   │   ├── shopController.js        # Wares catalog, purchase, equip, custom rewards
│   │   │   ├── characterController.js   # Potion drinking, stat calculations
│   │   │   └── analyticsController.js   # Activity logs and dashboard summary
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── shopRoutes.js
│   │   │   ├── characterRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   └── seeds/
│   │       └── seedData.js              # 16-bit starter equipment, themes, and badges
│   └── tests/
│       └── progression.test.js          # Unit tests for non-linear leveling & streaks
│
└── client/                              # React + Vite Frontend
    ├── package.json
    ├── vite.config.js                   # Vite config with API proxy
    ├── tailwind.config.js               # 16-bit retro color palette & pixel shadows
    ├── postcss.config.js
    ├── index.html                       # Google Fonts (Press Start 2P) & meta
    └── src/
        ├── index.css                    # Retro scanlines, pixel scrollbars, themes
        ├── main.jsx                     # Context wrapper & Error Boundary
        ├── App.jsx                      # Main dashboard, keyboard shortcuts, tabs
        ├── context/
        │   ├── AuthContext.jsx          # User state, session sync, theme application
        │   ├── AudioContext.jsx         # Web Audio API 8-bit sound controls
        │   └── ToastContext.jsx         # 16-bit alerts & floating combat text
        ├── services/
        │   ├── api.js                   # Axios instance with JWT interceptor
        │   ├── soundEngine.js           # Web Audio API real-time square wave synthesizer
        │   ├── taskService.js           # Quest CRUD API calls
        │   ├── shopService.js           # Shop & Custom rewards API calls
        │   ├── characterService.js      # Potion consumption & stat API calls
        │   └── analyticsService.js      # Activity logs API calls
        ├── utils/
        │   ├── leveling.js              # Level curves, classes, stat colors & configs
        │   └── confetti.js              # Canvas-confetti celebration triggers
        └── components/
            ├── common/
            │   ├── RetroButton.jsx      # Pixel beveled button with press sounds
            │   ├── RetroCard.jsx        # 16-bit dungeon bordered container
            │   ├── ProgressBar.jsx      # Segmented retro HP/XP/Gold meter
            │   ├── RetroModal.jsx       # Accessible keyboard-trapped modal
            │   ├── SkeletonLoader.jsx   # Shimmering latency masking skeletons
            │   └── ErrorBoundary.jsx    # Retro "Game Over / Respawn" error catcher
            ├── layout/
            │   ├── Navbar.jsx           # Top HUD: Level, HP, XP, Gold, Gems, Audio
            │   ├── NavigationTabs.jsx   # Quests, Character, Shop, Logbook
            │   └── Footer.jsx           # Keyboard shortcut guide
            ├── tasks/
            │   ├── TaskList.jsx         # Active & completed quest lists
            │   ├── TaskItem.jsx         # Optimistic check, floating text, habit +/-
            │   ├── TaskFormModal.jsx    # Create / Edit quest with reward preview
            │   └── TaskFilters.jsx      # Type, attribute, difficulty, & search filter
            ├── character/
            │   ├── CharacterCard.jsx    # Character profile, class crest, gear slots
            │   ├── AttributeRadar.jsx   # 6-attribute stat meters & gear bonuses
            │   ├── LevelUpModal.jsx     # Celebratory pop-up with fanfare & confetti
            │   └── InventoryDrawer.jsx  # Satchel: equip gear, drink potions
            ├── shop/
            │   ├── ShopGrid.jsx         # Merchant catalog & category switcher
            │   ├── ShopItemCard.jsx     # Price tags, buy/equip buttons
            │   └── CustomRewardModal.jsx# Custom real-life reward creator
            ├── analytics/
            │   ├── ActivityLogList.jsx  # Historical ledger of quest completions
            │   └── StreakTracker.jsx    # 7-day momentum tracker & streak bonuses
            └── auth/
                ├── LoginModal.jsx       # Resume quest modal
                └── RegisterModal.jsx    # Character class & alias creator
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
# Port
PORT=5000

# Environment Mode
NODE_ENV=development

# MongoDB Connection String (Atlas URI or Local MongoDB)
# Set USE_IN_MEMORY_DB=true to run instantly without pre-installing MongoDB
MONGODB_URI=mongodb://localhost:27017/liferpg
USE_IN_MEMORY_DB=true

# JWT Secret & Expiration
JWT_SECRET=super_secret_retro_life_rpg_key_2026!
JWT_EXPIRES_IN=7d

# CORS Allowed Origin
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Quickstart Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* Local MongoDB or MongoDB Atlas URI (if not using the automatic in-memory development engine).

### 1. Install All Dependencies
Run the root install script to install dependencies for root, server, and client in one command:
```bash
npm run install:all
```

### 2. Configure Environment
Copy `.env.example` to `.env` in the server directory:
```bash
cp server/.env.example server/.env
```
*(By default, `USE_IN_MEMORY_DB=true` is enabled so you can run the app immediately with zero database installation required).*

### 3. Launch Development Environment
Run both backend Express server and Vite frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

### 4. Build for Production
```bash
npm run build
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new adventurer & select character class | No |
| `POST` | `/api/auth/login` | Authenticate with username/email & password | No |
| `GET` | `/api/auth/me` | Fetch active character profile and stats | Yes |
| `PUT` | `/api/auth/settings` | Update sound and scanline preferences | Yes |

### Quests & Habits (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get tasks with optional filters (`type`, `stat`, `difficulty`, `search`) | Yes |
| `POST` | `/api/tasks` | Create new Quest, Daily, or Habit | Yes |
| `GET` | `/api/tasks/:id` | Get single task details | Yes |
| `PUT` | `/api/tasks/:id` | Update quest details | Yes |
| `DELETE` | `/api/tasks/:id` | Delete / abandon quest | Yes |
| `POST` | `/api/tasks/:id/complete` | Complete quest (awards XP, Gold, Stats, checks Level-Up) | Yes |
| `POST` | `/api/tasks/:id/habit` | Trigger habit (`PLUS` = rewards, `MINUS` = -10 HP damage) | Yes |

### Merchant & Shop (`/api/shop`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/shop` | Retrieve wares catalog & user custom rewards | Yes |
| `POST` | `/api/shop/purchase/:id` | Purchase item using in-game Gold/Gems | Yes |
| `POST` | `/api/shop/equip/:itemId` | Equip/unequip weapon, armor, theme, or badge | Yes |
| `POST` | `/api/shop/custom-reward` | Create custom real-life reward | Yes |
| `DELETE` | `/api/shop/custom-reward/:id` | Delete custom reward | Yes |

### Character & Analytics (`/api/character`, `/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/character/stats` | Detailed character attributes with gear breakdown | Yes |
| `POST` | `/api/character/consume/:id`| Drink healing potion to restore HP | Yes |
| `GET` | `/api/analytics/logs` | Historical timeline of completed quests & events | Yes |
| `GET` | `/api/analytics/summary` | Stat distribution & quest completion aggregates | Yes |

---

## 🔊 Audio Synthesis & Accessibility

### Web Audio Chiptune Engine
All sound effects are rendered natively by the browser's Web Audio API:
- **Victory Fanfare**: Ascending C-E-G-C-E arpeggio on level up.
- **Quest Chime**: Crisp harmonic square wave chime on quest completion.
- **Crystal Ding**: High-frequency dual tone on collecting gold.
- **Damage Hit**: Low sawtooth drop on giving in to negative habits.
- **Potion Sip**: Ascending bubble resonance when restoring HP.

### Keyboard Shortcuts
- <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Full focus navigation across buttons, cards, and checkboxes.
- <kbd>Space</kbd>: Check/uncheck quest checkbox.
- <kbd>N</kbd>: Open "Post New Quest" modal from anywhere.
- <kbd>I</kbd>: Open "Adventurer Satchel & Inventory" drawer.
- <kbd>M</kbd>: Instant global mute/unmute audio toggle.
- <kbd>Esc</kbd>: Dismiss any active dialog modal.

---

## 🧪 Automated Testing

To run the built-in progression and streak engine test suite:
```bash
npm run test
```

Verifies:
- Accurate calculation of the non-linear XP curve.
- Multi-level-up handling on huge XP rewards.
- Attribute allocation to matching task categories.
- Streak incrementation for consecutive days and reset upon missed days.
- Streak XP multiplier scaling and cap (+50%).

---

*Life RPG — Forge your real-world destiny one quest at a time!*
