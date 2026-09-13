import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Scroll, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import TaskItem from './TaskItem';
import SkeletonLoader from '../common/SkeletonLoader';

export const TaskList = ({
  tasks = [],
  isLoading,
  onTaskUpdated,
  onTaskDeleted,
  onEditTask,
  onLevelUp,
  onOpenNewQuest,
}) => {
  const [showCompleted, setShowCompleted] = useState(false);

  if (isLoading) {
    return <SkeletonLoader count={4} type="task" />;
  }

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-dungeon-900/60 border-2 border-dashed border-dungeon-border p-8">
        <div className="w-12 h-12 bg-dungeon-800 border-2 border-dungeon-700 flex items-center justify-center mx-auto mb-3 text-amber-400">
          <Scroll className="w-6 h-6" />
        </div>
        <h3 className="font-pixel text-slate-300 text-sm mb-2 uppercase">No Active Quests Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 font-sans">
          The dungeon board is quiet. Post a new quest to start earning XP, Gold, and attribute power!
        </p>
        <button
          onClick={onOpenNewQuest}
          className="font-pixel text-xs px-4 py-2 bg-purple-700 hover:bg-purple-600 border-2 border-purple-400 text-white shadow-pixel active:translate-y-[1px]"
        >
          + Post First Quest
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Tasks */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {activeTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
              onEditTask={onEditTask}
              onLevelUp={onLevelUp}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Completed Tasks (Collapsible Section) */}
      {completedTasks.length > 0 && (
        <div className="pt-4 border-t border-dungeon-800">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 font-pixel text-xs text-slate-400 hover:text-slate-200 py-1"
          >
            {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed Quests ({completedTasks.length})</span>
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-3 pl-2 sm:pl-4 border-l-2 border-dungeon-800">
              <AnimatePresence>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onTaskUpdated={onTaskUpdated}
                    onTaskDeleted={onTaskDeleted}
                    onEditTask={onEditTask}
                    onLevelUp={onLevelUp}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
