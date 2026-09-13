import React, { useState } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Tv,
  LogOut,
  Shield,
  Wand,
  Zap,
  Heart,
  Feather,
  FlaskConical,
  Gem,
  Coins,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import ProgressBar from '../common/ProgressBar';
import { getXpForNextLevel } from '../../utils/leveling';
import { consumePotion } from '../../services/characterService';

const CLASS_ICONS = {
  WARRIOR: Shield,
  MAGE: Wand,
  ROGUE: Zap,
  PALADIN: Heart,
  HEALER: Feather,
  ALCHEMIST: FlaskConical,
};

export const Navbar = ({ onOpenNewQuest, onOpenInventory }) => {
  const { user, logout, updateCharacter } = useAuth();
  const { isMuted, toggleMute, playPotion, playDamage } = useAudio();
  const { addToast, addFloatingText } = useToast();
  const [scanlinesActive, setScanlinesActive] = useState(true);

  if (!user) return null;

  const character = user.character;
  const streak = user.streak;
  const ClassIcon = CLASS_ICONS[character.class] || Shield;
  const nextLevelXp = getXpForNextLevel(character.level);

  // Toggle CRT scanlines on document body
  const toggleScanlines = () => {
    const nextState = !scanlinesActive;
    setScanlinesActive(nextState);
    const overlay = document.getElementById('scanline-overlay');
    if (overlay) {
      overlay.style.display = nextState ? 'block' : 'none';
    }
  };

  // Quick drink potion if in inventory
  const handleQuickHeal = async () => {
    const potion = character.inventory.find((i) => i.type === 'POTION' && i.quantity > 0);
    if (!potion) {
      addToast('No healing potions in your satchel! Visit the merchant shop.', 'info');
      return;
    }

    if (character.hp.current >= character.hp.max) {
      addToast('Your Health is already full!', 'info');
      return;
    }

    try {
      playPotion();
      const res = await consumePotion(potion.itemId);
      if (res.success) {
        updateCharacter(res.character);
        addFloatingText(`+${potion.healAmount} HP`, { color: '#22c55e' });
        addToast(res.message, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not drink potion', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-dungeon-900 border-b-4 border-dungeon-border shadow-pixel">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Player Identity & Class */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              onClick={onOpenInventory}
              title="Open Inventory & Gear"
              className="flex items-center gap-3 p-1.5 bg-dungeon-800 border-2 border-dungeon-borderHighlight hover:border-amber-400 transition-colors shadow-pixel-sm text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-950 border-2 border-purple-500 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <ClassIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-pixel text-xs text-amber-300 font-bold">{character.name}</span>
                  <span className="bg-purple-900/80 border border-purple-500 px-1 py-0.2 font-pixel text-[9px] text-purple-200">
                    LVL {character.level}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans tracking-wide">
                  {character.title} • <span className="text-purple-300">{character.class}</span>
                </div>
              </div>
            </button>

            {/* Quick Actions (Mobile) */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onOpenNewQuest}
                className="p-2 bg-purple-700 hover:bg-purple-600 border-2 border-purple-400 text-white shadow-pixel-sm active:translate-y-[1px]"
                aria-label="Create Quest"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="p-2 bg-dungeon-800 hover:bg-rose-900 border-2 border-dungeon-700 hover:border-rose-500 text-slate-400 hover:text-white shadow-pixel-sm"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: HP & XP Progress Bars */}
          <div className="w-full md:max-w-md grid grid-cols-2 gap-2 sm:gap-4">
            {/* HP Bar with quick heal trigger */}
            <div className="relative group">
              <ProgressBar
                current={character.hp.current}
                max={character.hp.max}
                variant="hp"
                height="h-3 sm:h-3.5"
              />
              {character.hp.current < character.hp.max && (
                <button
                  onClick={handleQuickHeal}
                  className="absolute -top-1 -right-1 bg-red-600 hover:bg-red-500 text-[9px] font-pixel text-white px-1 border border-red-300 shadow-pixel-sm animate-pulse"
                  title="Click to drink Healing Potion"
                >
                  HEAL
                </button>
              )}
            </div>

            {/* XP Bar */}
            <div>
              <ProgressBar
                current={character.currentXp}
                max={nextLevelXp}
                variant="xp"
                height="h-3 sm:h-3.5"
              />
            </div>
          </div>

          {/* Right: Currency, Streak & Settings */}
          <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-3">
            {/* Currencies */}
            <div className="flex items-center gap-2 bg-dungeon-950 px-2.5 py-1.5 border border-dungeon-800 shadow-pixel-sm">
              <div className="flex items-center gap-1 text-amber-400 font-pixel text-[11px]" title="Gold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{character.gold}</span>
              </div>
              <div className="w-px h-3 bg-dungeon-800" />
              <div className="flex items-center gap-1 text-sky-400 font-pixel text-[11px]" title="Gems">
                <Gem className="w-3.5 h-3.5 text-sky-400" />
                <span>{character.gems}</span>
              </div>
            </div>

            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1 bg-amber-950/60 border border-amber-600/60 px-2 py-1.5 text-amber-400 font-pixel text-[10px] shadow-pixel-sm"
              title={`Consecutive Days: ${streak.current}. Multiplier applied!`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
              <span>{streak.current}D</span>
            </div>

            {/* Controls (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 bg-dungeon-800 hover:bg-dungeon-700 border border-dungeon-border text-slate-300 hover:text-white shadow-pixel-sm transition-colors"
                title={isMuted ? 'Unmute 8-Bit Audio' : 'Mute Audio'}
                aria-label="Toggle sound"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={toggleScanlines}
                className={`p-1.5 bg-dungeon-800 hover:bg-dungeon-700 border border-dungeon-border shadow-pixel-sm transition-colors ${
                  scanlinesActive ? 'text-purple-400 border-purple-500' : 'text-slate-500'
                }`}
                title="Toggle CRT Scanline Overlay"
                aria-label="Toggle CRT scanlines"
              >
                <Tv className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-1.5 bg-dungeon-800 hover:bg-rose-950 border border-dungeon-border hover:border-rose-500 text-slate-400 hover:text-rose-300 shadow-pixel-sm transition-colors"
                title="Leave Dungeon (Logout)"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
