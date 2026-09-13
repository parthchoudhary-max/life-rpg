import React from 'react';
import { useAudio } from '../../context/AudioContext';

const VARIANTS = {
  primary:
    'bg-purple-700 hover:bg-purple-600 text-purple-100 border-purple-400 active:bg-purple-800 focus:ring-purple-400',
  secondary:
    'bg-dungeon-800 hover:bg-dungeon-700 text-slate-200 border-dungeon-borderHighlight active:bg-dungeon-900 focus:ring-dungeon-borderHighlight',
  gold:
    'bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold border-amber-300 active:bg-amber-600 focus:ring-amber-300',
  danger:
    'bg-rose-700 hover:bg-rose-600 text-rose-100 border-rose-400 active:bg-rose-800 focus:ring-rose-400',
  success:
    'bg-emerald-700 hover:bg-emerald-600 text-emerald-100 border-emerald-400 active:bg-emerald-800 focus:ring-emerald-400',
  cyan:
    'bg-cyan-700 hover:bg-cyan-600 text-cyan-100 border-cyan-400 active:bg-cyan-800 focus:ring-cyan-400',
};

const SIZES = {
  xs: 'px-2 py-1 text-[10px]',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs md:text-sm',
  lg: 'px-6 py-3 text-sm md:text-base',
};

export const RetroButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  playSound = true,
  ...props
}) => {
  const { playClick } = useAudio();

  const handleClick = (e) => {
    if (disabled) return;
    if (playSound) playClick();
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-pixel uppercase tracking-wider select-none
        border-2 shadow-pixel transition-all duration-75
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dungeon-950
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-sm
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-pixel
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size] || SIZES.md}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default RetroButton;
