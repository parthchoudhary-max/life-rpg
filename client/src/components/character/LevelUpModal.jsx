import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Heart, Coins } from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { triggerLevelUpBurst } from '../../utils/confetti';
import { useAudio } from '../../context/AudioContext';

export const LevelUpModal = ({ isOpen, onClose, levelUpData }) => {
  const { playLevelUp } = useAudio();

  useEffect(() => {
    if (isOpen) {
      playLevelUp();
      triggerLevelUpBurst();
    }
  }, [isOpen, playLevelUp]);

  if (!levelUpData) return null;

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title="Quest Mastery Achieved!"
      maxWidth="max-w-md"
      icon={Trophy}
    >
      <div className="text-center py-2 space-y-4">
        {/* Glowing Level Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 mx-auto bg-purple-950 border-4 border-amber-400 flex flex-col items-center justify-center text-amber-300 shadow-pixel-gold"
        >
          <span className="text-[10px] font-pixel text-purple-300 uppercase">Level</span>
          <span className="text-4xl font-pixel font-bold text-amber-400">
            {levelUpData.newLevel}
          </span>
        </motion.div>

        <div>
          <h2 className="font-pixel text-lg text-amber-300 uppercase tracking-wide">
            Level Up!
          </h2>
          <p className="font-pixel text-xs text-purple-300 mt-1">
            "{levelUpData.newTitle}"
          </p>
          <p className="text-xs text-slate-300 mt-2 font-sans max-w-xs mx-auto">
            Your perseverance in the mortal realm fuels your heroic transcendence!
          </p>
        </div>

        {/* Level Up Rewards */}
        <div className="p-3 bg-dungeon-950 border-2 border-dungeon-800 space-y-2 text-xs font-pixel text-slate-200 text-left">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Full Health Restored!
            </span>
            <span>100% HP</span>
          </div>

          <div className="flex items-center justify-between text-amber-400">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" /> Level-up Bounty
            </span>
            <span>+{levelUpData.bonusGold || 50} Gold</span>
          </div>

          <div className="flex items-center justify-between text-purple-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Max HP Increase
            </span>
            <span>+10 Max HP</span>
          </div>
        </div>

        <RetroButton
          variant="gold"
          size="lg"
          onClick={onClose}
          className="w-full mt-2"
        >
          Claim Glory & Continue
        </RetroButton>
      </div>
    </RetroModal>
  );
};

export default LevelUpModal;
