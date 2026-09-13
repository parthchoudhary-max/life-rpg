import React from 'react';
import { Flame, Award, Zap } from 'lucide-react';
import RetroCard from '../common/RetroCard';

export const StreakTracker = ({ streak = {} }) => {
  const current = streak.current || 1;
  const longest = streak.longest || 1;
  const bonusMultiplier = Math.min(50, (current - 1) * 5);

  // Generate 7-day mini tracker
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <RetroCard title="Streak & Momentum" icon={Flame}>
      <div className="space-y-4">
        {/* Main Stats Banner */}
        <div className="flex items-center justify-between p-3 bg-amber-950/30 border-2 border-amber-500/50 shadow-pixel-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="font-pixel text-base text-amber-300">{current} Day Streak</div>
              <div className="text-xs text-slate-400 font-sans mt-0.5">
                Longest Run: <span className="text-amber-400 font-pixel text-[10px]">{longest} Days</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 font-pixel text-[11px] text-emerald-400 bg-emerald-950 border border-emerald-500 px-2 py-1 shadow-pixel-sm">
              <Zap className="w-3 h-3" />
              +{bonusMultiplier}% XP Boost
            </span>
          </div>
        </div>

        {/* 7-Day Visual Progression Grid */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-pixel text-slate-400 mb-2 uppercase">
            <span>Recent Activity Momentum</span>
            <span className="text-amber-400">Streak Active</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {daysOfWeek.map((day, idx) => {
              const isPastStreak = idx < Math.min(7, current);
              return (
                <div
                  key={idx}
                  className={`
                    p-2 border-2 transition-all flex flex-col items-center justify-center
                    ${
                      isPastStreak
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-pixel-sm'
                        : 'bg-dungeon-950 border-dungeon-800 text-slate-600'
                    }
                  `}
                >
                  <span className="font-pixel text-[9px]">{day}</span>
                  <div
                    className={`w-2 h-2 mt-1 rounded-none ${
                      isPastStreak ? 'bg-amber-400' : 'bg-dungeon-800'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Momentum Tip */}
        <div className="text-xs text-slate-400 font-sans p-2.5 bg-dungeon-950 border border-dungeon-800">
          <p>
            <strong className="text-amber-300 font-pixel text-[10px]">Rule of the Flame: </strong>
            Complete at least one quest or daily ritual each calendar day to maintain your streak. Each day adds +5% bonus XP (up to +50% max).
          </p>
        </div>
      </div>
    </RetroCard>
  );
};

export default StreakTracker;
