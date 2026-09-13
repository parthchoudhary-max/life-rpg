import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Plus,
  Minus,
  Calendar,
  Flame,
  Trash2,
  Edit,
  Brain,
  Dumbbell,
  Zap,
  Heart,
  BookOpen,
  Users,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import { STAT_CONFIG, DIFFICULTY_CONFIG } from '../../utils/leveling';
import { completeTask, triggerHabit, deleteTask } from '../../services/taskService';
import { triggerCelebration } from '../../utils/confetti';

const STAT_ICONS = {
  Brain,
  Dumbbell,
  Zap,
  Heart,
  BookOpen,
  Users,
};

export const TaskItem = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onEditTask,
  onLevelUp,
}) => {
  const { playQuestComplete, playCoin, playDamage, playClick } = useAudio();
  const { addToast, addFloatingText } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const statInfo = STAT_CONFIG[task.stat] || STAT_CONFIG.intellect;
  const diffInfo = DIFFICULTY_CONFIG[task.difficulty] || DIFFICULTY_CONFIG.MEDIUM;
  const StatIcon = STAT_ICONS[statInfo.icon] || Brain;

  // Complete one-off quest or daily
  const handleComplete = async (e) => {
    e.stopPropagation();
    if (task.completed || isProcessing) return;

    setIsProcessing(true);
    playQuestComplete();
    playCoin();
    triggerCelebration();

    // Floating combat numbers
    addFloatingText(`+${diffInfo.xp} XP`, { color: '#c084fc' });
    addFloatingText(`+${diffInfo.gold} Gold`, { color: '#fbbf24', y: window.innerHeight / 2 - 20 });

    try {
      const res = await completeTask(task._id);
      if (res.success) {
        onTaskUpdated(res.task, res.character, res.streak);
        addToast(res.message, 'success');

        if (res.levelUp?.occurred) {
          onLevelUp(res.levelUp, res.character);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to complete quest', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Trigger habit plus / minus
  const handleHabitAction = async (action, e) => {
    e.stopPropagation();
    if (isProcessing) return;

    setIsProcessing(true);
    if (action === 'PLUS') {
      playQuestComplete();
      playCoin();
      addFloatingText(`+${Math.round(diffInfo.xp * 0.5)} XP`, { color: '#a855f7' });
    } else {
      playDamage();
      addFloatingText('-10 HP', { color: '#ef4444' });
    }

    try {
      const res = await triggerHabit(task._id, action);
      if (res.success) {
        onTaskUpdated(res.task, res.character);
        addToast(res.message, action === 'PLUS' ? 'success' : 'error');

        if (res.levelUp?.occurred) {
          onLevelUp(res.levelUp, res.character);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not update habit', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete quest
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Abandon quest "${task.title}"?`)) {
      playClick();
      try {
        await deleteTask(task._id);
        onTaskDeleted(task._id);
        addToast('Quest removed from notice board', 'info');
      } catch (err) {
        addToast('Failed to abandon quest', 'error');
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        relative group p-3.5 sm:p-4 bg-dungeon-900 border-2
        ${task.completed ? 'border-dungeon-800/80 bg-dungeon-950/60 opacity-60' : 'border-dungeon-border hover:border-dungeon-borderHighlight shadow-pixel'}
        flex items-start justify-between gap-3 transition-colors
      `}
    >
      {/* Left Action: Checkbox (Quest/Daily) OR Habit Buttons */}
      <div className="shrink-0 mt-0.5">
        {task.type === 'HABIT' ? (
          <div className="flex flex-col gap-1">
            {(task.habitType === 'POSITIVE' || task.habitType === 'BOTH') && (
              <button
                onClick={(e) => handleHabitAction('PLUS', e)}
                disabled={isProcessing}
                className="w-7 h-7 bg-emerald-950 hover:bg-emerald-800 border-2 border-emerald-500 text-emerald-300 flex items-center justify-center active:scale-95 shadow-pixel-sm transition-transform"
                title="Reinforce positive habit (+XP, +Gold)"
                aria-label="Positive habit action"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            {(task.habitType === 'NEGATIVE' || task.habitType === 'BOTH') && (
              <button
                onClick={(e) => handleHabitAction('MINUS', e)}
                disabled={isProcessing}
                className="w-7 h-7 bg-rose-950 hover:bg-rose-800 border-2 border-rose-500 text-rose-300 flex items-center justify-center active:scale-95 shadow-pixel-sm transition-transform"
                title="Give in to vice (-10 HP)"
                aria-label="Negative habit penalty"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={task.completed || isProcessing}
            role="checkbox"
            aria-checked={task.completed}
            className={`
              w-7 h-7 border-2 flex items-center justify-center transition-all shadow-pixel-sm
              ${
                task.completed
                  ? 'bg-emerald-900 border-emerald-400 text-white'
                  : 'bg-dungeon-950 border-dungeon-borderHighlight hover:border-amber-400 hover:bg-dungeon-800 text-transparent active:scale-90'
              }
            `}
            title={task.completed ? 'Completed' : 'Click or Press Space to Slay Quest'}
            aria-label={`Complete quest: ${task.title}`}
          >
            <Check className={`w-4 h-4 stroke-[3] ${task.completed ? 'text-emerald-300' : 'group-hover:text-amber-400/40'}`} />
          </button>
        )}
      </div>

      {/* Center: Quest Content & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`font-pixel text-xs sm:text-sm font-bold tracking-wide break-words ${
              task.completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {/* Difficulty Badge */}
          <span
            className="px-1.5 py-0.5 text-[9px] font-pixel border shadow-pixel-sm"
            style={{
              borderColor: diffInfo.color,
              color: diffInfo.color,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          >
            {diffInfo.label}
          </span>

          {/* Stat Badge */}
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-pixel border"
            style={{
              borderColor: statInfo.border,
              color: statInfo.color,
              backgroundColor: statInfo.bg,
            }}
          >
            <StatIcon className="w-3 h-3" />
            <span>+{diffInfo.xp} XP ({statInfo.short})</span>
          </span>

          {/* Habit counts */}
          {task.type === 'HABIT' && (
            <span className="text-[10px] font-pixel text-slate-400">
              (+{task.positiveCount || 0} / -{task.negativeCount || 0})
            </span>
          )}

          {/* Streak Badge */}
          {task.streak > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-pixel text-orange-400 bg-orange-950/40 border border-orange-700/50 px-1 py-0.5">
              <Flame className="w-3 h-3 text-orange-500" />
              {task.streak}
            </span>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans font-normal line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Due date tag */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] font-pixel text-slate-400 mt-2">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Right: Actions Menu (Edit & Delete) */}
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEditTask(task)}
          className="p-1.5 hover:bg-dungeon-800 border border-transparent hover:border-dungeon-700 text-slate-400 hover:text-slate-200"
          title="Edit Quest"
          aria-label="Edit Quest"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-rose-950 border border-transparent hover:border-rose-700 text-slate-400 hover:text-rose-300"
          title="Abandon Quest"
          aria-label="Abandon Quest"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
