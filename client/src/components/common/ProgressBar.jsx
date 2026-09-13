import React from 'react';
import { motion } from 'framer-motion';

const BAR_STYLES = {
  hp: {
    bg: 'bg-red-950',
    border: 'border-red-900',
    bar: 'bg-gradient-to-r from-red-600 to-rose-500',
    glow: 'shadow-[0_0_8px_rgba(239,68,68,0.5)]',
    label: 'HP',
    textColor: 'text-red-200',
  },
  xp: {
    bg: 'bg-purple-950',
    border: 'border-purple-900',
    bar: 'bg-gradient-to-r from-purple-600 to-fuchsia-500',
    glow: 'shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    label: 'XP',
    textColor: 'text-purple-200',
  },
  mana: {
    bg: 'bg-blue-950',
    border: 'border-blue-900',
    bar: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    label: 'MP',
    textColor: 'text-blue-200',
  },
  gold: {
    bg: 'bg-amber-950',
    border: 'border-amber-900',
    bar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    glow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    label: 'GOLD',
    textColor: 'text-amber-200',
  },
};

export const ProgressBar = ({
  current = 0,
  max = 100,
  variant = 'xp',
  showLabel = true,
  height = 'h-4',
  className = '',
}) => {
  const style = BAR_STYLES[variant] || BAR_STYLES.xp;
  const percentage = Math.min(100, Math.max(0, Math.round((current / (max || 1)) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-[10px] font-pixel mb-1 text-slate-300">
          <span className={`font-bold ${style.textColor}`}>{style.label}</span>
          <span className="tracking-widest">
            {current} / {max} ({percentage}%)
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${style.label} progress bar`}
        className={`relative w-full ${height} ${style.bg} border-2 ${style.border} p-0.5 overflow-hidden shadow-pixel-sm`}
      >
        {/* Retro segmented grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_9px,rgba(0,0,0,0.4)_10px)] bg-[size:10px_100%] pointer-events-none z-10" />

        {/* Animated Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className={`h-full ${style.bar} ${style.glow}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
