import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle,
  Sparkles,
  Trophy,
  ShoppingBag,
  Heart,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import RetroCard from '../common/RetroCard';
import SkeletonLoader from '../common/SkeletonLoader';
import { getActivityLogs } from '../../services/analyticsService';

const LOG_ICONS = {
  QUEST_COMPLETED: CheckCircle,
  DAILY_COMPLETED: CheckCircle,
  HABIT_TRACKED: Flame,
  LEVEL_UP: Trophy,
  ITEM_PURCHASED: ShoppingBag,
  ITEM_EQUIPPED: Sparkles,
  POTION_CONSUMED: Heart,
  STREAK_MILESTONE: Flame,
  PENALTY_INCURRED: AlertTriangle,
};

export const ActivityLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await getActivityLogs({ limit: 30 });
        if (res.success) {
          setLogs(res.logs);
        }
      } catch (err) {
        console.error('Failed to load activity log:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <SkeletonLoader count={5} />;
  }

  return (
    <RetroCard title="Adventurer Chronicle & Ledger" icon={BookOpen}>
      {logs.length === 0 ? (
        <div className="text-center py-8 text-slate-500 font-pixel text-xs">
          No historical events recorded yet. Complete quests to write your chronicle!
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {logs.map((log) => {
            const Icon = LOG_ICONS[log.type] || Sparkles;
            const isLevelUp = log.type === 'LEVEL_UP';
            const isPenalty = log.type === 'PENALTY_INCURRED';

            return (
              <div
                key={log._id}
                className={`
                  p-3 border-2 flex items-start justify-between gap-3 text-xs transition-colors
                  ${
                    isLevelUp
                      ? 'bg-purple-950/40 border-purple-500/80 shadow-pixel-xp'
                      : isPenalty
                      ? 'bg-rose-950/40 border-rose-600/80'
                      : 'bg-dungeon-950 border-dungeon-800'
                  }
                `}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`p-1.5 border mt-0.5 shrink-0 ${
                      isLevelUp
                        ? 'bg-purple-900 border-purple-400 text-amber-300'
                        : isPenalty
                        ? 'bg-rose-900 border-rose-500 text-rose-200'
                        : 'bg-dungeon-900 border-dungeon-700 text-amber-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-pixel text-[11px] text-slate-100">{log.title}</h4>
                    {log.details && (
                      <p className="text-slate-400 font-sans mt-0.5 text-[11px] leading-relaxed">
                        {log.details}
                      </p>
                    )}
                    <span className="text-[9px] font-pixel text-slate-500 mt-1 inline-block">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Yields Badge */}
                <div className="text-right shrink-0 font-pixel text-[10px] space-y-0.5">
                  {log.xpEarned > 0 && <div className="text-purple-300">+{log.xpEarned} XP</div>}
                  {log.goldEarned > 0 && <div className="text-amber-400">+{log.goldEarned} G</div>}
                  {log.goldEarned < 0 && <div className="text-rose-400">{log.goldEarned} G</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </RetroCard>
  );
};

export default ActivityLogList;
