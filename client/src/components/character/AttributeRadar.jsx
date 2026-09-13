import React from 'react';
import { Brain, Dumbbell, Zap, Heart, BookOpen, Users, Award } from 'lucide-react';
import RetroCard from '../common/RetroCard';
import { STAT_CONFIG } from '../../utils/leveling';

const STAT_ICONS = {
  Brain,
  Dumbbell,
  Zap,
  Heart,
  BookOpen,
  Users,
};

export const AttributeRadar = ({ attributes = {}, gearBonuses = {} }) => {
  return (
    <RetroCard title="Attributes & Disciplines" icon={Award}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(STAT_CONFIG).map(([key, info]) => {
          const Icon = STAT_ICONS[info.icon] || Brain;
          const baseVal = attributes[key] || 10;
          const gearVal = gearBonuses[key] || 0;
          const totalVal = baseVal + gearVal;
          // Benchmark cap for progress display
          const progressPercent = Math.min(100, Math.round((totalVal / 50) * 100));

          return (
            <div
              key={key}
              className="p-3 bg-dungeon-950 border border-dungeon-800 hover:border-dungeon-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1 rounded-none"
                    style={{ backgroundColor: info.bg, color: info.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-pixel text-[11px] font-bold" style={{ color: info.color }}>
                      {info.label}
                    </span>
                    <span className="text-[9px] font-pixel text-slate-500 ml-1.5">({info.short})</span>
                  </div>
                </div>

                <div className="font-pixel text-xs text-slate-200">
                  <span>{totalVal}</span>
                  {gearVal > 0 && (
                    <span className="text-[10px] text-emerald-400 ml-1 font-sans">
                      (+{gearVal} Gear)
                    </span>
                  )}
                </div>
              </div>

              {/* Stat Progress Bar */}
              <div className="w-full h-2 bg-dungeon-900 border border-dungeon-800 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: info.color,
                  }}
                />
              </div>

              <div className="text-[10px] text-slate-400 mt-1 font-sans line-clamp-1">
                {info.description}
              </div>
            </div>
          );
        })}
      </div>
    </RetroCard>
  );
};

export default AttributeRadar;
