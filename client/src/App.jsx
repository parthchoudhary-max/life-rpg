import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Sword,
  Shield,
  Trophy,
  Flame,
  Plus,
  Play,
  UserPlus,
  KeyRound,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useAudio } from './context/AudioContext';
import { useToast } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import NavigationTabs from './components/layout/NavigationTabs';
import Footer from './components/layout/Footer';
import TaskList from './components/tasks/TaskList';
import TaskFilters from './components/tasks/TaskFilters';
import TaskFormModal from './components/tasks/TaskFormModal';
import CharacterCard from './components/character/CharacterCard';
import AttributeRadar from './components/character/AttributeRadar';
import LevelUpModal from './components/character/LevelUpModal';
import InventoryDrawer from './components/character/InventoryDrawer';
import StreakTracker from './components/analytics/StreakTracker';
import ShopGrid from './components/shop/ShopGrid';
import ActivityLogList from './components/analytics/ActivityLogList';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import RetroButton from './components/common/RetroButton';
import SkeletonLoader from './components/common/SkeletonLoader';
import { getTasks } from './services/taskService';
import { getCharacterStats } from './services/characterService';

export const App = () => {
  const { user, loading: authLoading, updateCharacter, updateStreak } = useAuth();
  const { toggleMute } = useAudio();
  const { addToast } = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState('quests');

  // Task Filter State
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskType, setTaskType] = useState('TODO');
  const [selectedStat, setSelectedStat] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Character Detail Stats (Base + Gear breakdown)
  const [characterStats, setCharacterStats] = useState(null);

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Fetch tasks for logged-in user
  const fetchTasksList = useCallback(async () => {
    if (!user) return;
    try {
      setTasksLoading(true);
      const res = await getTasks({
        type: taskType,
        stat: selectedStat || undefined,
        difficulty: selectedDifficulty || undefined,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  }, [user, taskType, selectedStat, selectedDifficulty, searchQuery]);

  // Fetch character stats breakdown
  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const res = await getCharacterStats();
      if (res.success) {
        setCharacterStats(res);
      }
    } catch (err) {
      console.error('Failed to fetch character stats:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTasksList();
      fetchStats();
    }
  }, [user, fetchTasksList, fetchStats]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't trigger shortcuts when typing inside an input/textarea
      const tagName = e.target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        if (user) {
          e.preventDefault();
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }
      } else if (e.key === 'i' || e.key === 'I') {
        if (user) {
          e.preventDefault();
          setIsInventoryOpen((prev) => !prev);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [user, toggleMute]);

  // Task Callback Handlers
  const handleTaskUpdated = (updatedTask, newCharacter, newStreak) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
    if (newCharacter) updateCharacter(newCharacter);
    if (newStreak) updateStreak(newStreak);
    fetchStats();
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    fetchStats();
  };

  const handleTaskSaved = (savedTask, isEdit) => {
    if (isEdit) {
      setTasks((prev) =>
        prev.map((t) => (t._id === savedTask._id ? savedTask : t))
      );
    } else {
      if (savedTask.type === taskType) {
        setTasks((prev) => [savedTask, ...prev]);
      }
    }
    fetchStats();
  };

  const handleLevelUp = (levelData, newCharacter) => {
    setLevelUpData(levelData);
    setIsLevelUpModalOpen(true);
    if (newCharacter) updateCharacter(newCharacter);
    fetchStats();
  };

  const handleCharacterUpdated = (newCharacter) => {
    updateCharacter(newCharacter);
    fetchStats();
  };

  const activeQuestCount = tasks.filter((t) => !t.completed).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dungeon-950 flex flex-col items-center justify-center p-4">
        <div className="text-amber-400 font-pixel text-sm mb-4 animate-pulse">
          INITIALIZING DUNGEON REALM...
        </div>
        <div className="w-48">
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  // Guest Landing View (Unauthenticated)
  if (!user) {
    return (
      <div className="min-h-screen bg-dungeon-950 flex flex-col justify-between relative overflow-hidden">
        {/* CRT Scanline Overlay */}
        <div
          id="scanline-overlay"
          className="scanlines-overlay fixed inset-0 z-30 pointer-events-none"
        />

        {/* Guest Header */}
        <header className="p-4 sm:p-6 border-b-2 border-dungeon-800 bg-dungeon-900/80 backdrop-blur-sm z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950 border-2 border-amber-400 text-amber-400">
              <Sword className="w-5 h-5" />
            </div>
            <span className="font-pixel text-sm sm:text-base text-amber-400 tracking-wider">
              LIFE RPG
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RetroButton
              variant="secondary"
              size="sm"
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Login</span>
            </RetroButton>
            <RetroButton
              variant="gold"
              size="sm"
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </RetroButton>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-4xl mx-auto px-4 py-12 text-center z-10 my-auto">
          <div className="inline-block px-3 py-1 bg-purple-950/80 border border-purple-500 font-pixel text-[10px] text-purple-300 mb-6 shadow-pixel-sm uppercase">
            Solve Delayed Gratification with 16-Bit Gamification
          </div>

          <h1 className="font-pixel text-xl sm:text-3xl md:text-4xl text-slate-100 leading-tight mb-6 uppercase">
            Turn Mundane Tasks Into <span className="text-amber-400">Heroic Power</span>
          </h1>

          <p className="text-slate-300 font-sans text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Standard to-do lists leave you starving for instant dopamine. In <strong>Life RPG</strong>, coding levels up your <span className="text-sky-400">Intellect</span>, working out elevates <span className="text-rose-400">Strength</span>, and daily consistency unlocks weapons, themes, and celebratory fanfare.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <RetroButton
              variant="gold"
              size="lg"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-pixel-gold"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Press Start (Create Hero)</span>
            </RetroButton>
            <RetroButton
              variant="secondary"
              size="lg"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <span>Resume Saved Quest</span>
            </RetroButton>
          </div>

          {/* 3 Pillar Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-dungeon-900 border-2 border-dungeon-border shadow-pixel">
              <div className="p-2 bg-purple-950 border border-purple-600 text-purple-300 w-fit mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xs text-amber-300 mb-1.5 uppercase">Non-Linear Leveling</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Experience satisfying exponential XP curves, multi-level up celebrations, and glorious unlocked titles.
              </p>
            </div>

            <div className="p-4 bg-dungeon-900 border-2 border-dungeon-border shadow-pixel">
              <div className="p-2 bg-amber-950 border border-amber-600 text-amber-400 w-fit mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xs text-amber-300 mb-1.5 uppercase">Daily Momentum</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Consecutive daily activity awards streak multipliers (up to +50% XP and Gold bonus bounties).
              </p>
            </div>

            <div className="p-4 bg-dungeon-900 border-2 border-dungeon-border shadow-pixel">
              <div className="p-2 bg-rose-950 border border-rose-600 text-rose-400 w-fit mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-pixel text-xs text-amber-300 mb-1.5 uppercase">Discipline Economy</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Earn in-game gold to buy weapons, retro UI themes, or craft custom guilt-free real-world rewards.
              </p>
            </div>
          </div>
        </main>

        <Footer />

        {/* Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />

        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </div>
    );
  }

  // Authenticated Player Dashboard
  return (
    <div className="min-h-screen bg-dungeon-950 flex flex-col justify-between relative selection:bg-purple-600 selection:text-white">
      {/* CRT Scanline Overlay */}
      <div
        id="scanline-overlay"
        className="scanlines-overlay fixed inset-0 z-30 pointer-events-none"
      />

      {/* Player Top HUD */}
      <Navbar
        onOpenNewQuest={() => {
          setTaskToEdit(null);
          setIsTaskModalOpen(true);
        }}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      {/* Main Game Interface */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 flex-1 z-10">
        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          activeQuestCount={activeQuestCount}
        />

        {/* Tab 1: Quests & Habits */}
        {activeTab === 'quests' && (
          <div className="space-y-4">
            <TaskFilters
              activeType={taskType}
              onSelectType={setTaskType}
              selectedStat={selectedStat}
              onSelectStat={setSelectedStat}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenNewQuest={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            />

            <TaskList
              tasks={tasks}
              isLoading={tasksLoading}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onEditTask={(task) => {
                setTaskToEdit(task);
                setIsTaskModalOpen(true);
              }}
              onLevelUp={handleLevelUp}
              onOpenNewQuest={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 2: Character & Stats */}
        {activeTab === 'character' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <CharacterCard
                  character={user.character}
                  onOpenInventory={() => setIsInventoryOpen(true)}
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <AttributeRadar
                  attributes={characterStats?.attributes?.base || user.character.attributes}
                  gearBonuses={characterStats?.attributes?.gearBonuses || {}}
                />
                <StreakTracker streak={user.streak} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Merchant & Shop */}
        {activeTab === 'shop' && (
          <ShopGrid
            character={user.character}
            onCharacterUpdated={handleCharacterUpdated}
          />
        )}

        {/* Tab 4: Logbook & History */}
        {activeTab === 'logs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityLogList />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <StreakTracker streak={user.streak} />
              <CharacterCard
                character={user.character}
                onOpenInventory={() => setIsInventoryOpen(true)}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Modals & Drawers */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        onTaskSaved={handleTaskSaved}
      />

      <InventoryDrawer
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        character={user.character}
        onCharacterUpdated={handleCharacterUpdated}
      />

      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        levelUpData={levelUpData}
      />
    </div>
  );
};

export default App;
