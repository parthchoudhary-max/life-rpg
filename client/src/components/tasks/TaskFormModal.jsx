import React, { useState, useEffect } from 'react';
import { Scroll, Sparkles } from 'lucide-react';
import RetroModal from '../common/RetroModal';
import RetroButton from '../common/RetroButton';
import { STAT_CONFIG, DIFFICULTY_CONFIG } from '../../utils/leveling';
import { createTask, updateTask } from '../../services/taskService';
import { useToast } from '../../context/ToastContext';

export const TaskFormModal = ({
  isOpen,
  onClose,
  taskToEdit = null,
  onTaskSaved,
}) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'TODO',
    stat: 'intellect',
    difficulty: 'MEDIUM',
    dueDate: '',
    habitType: 'BOTH',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        type: taskToEdit.type || 'TODO',
        stat: taskToEdit.stat || 'intellect',
        difficulty: taskToEdit.difficulty || 'MEDIUM',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : '',
        habitType: taskToEdit.habitType || 'BOTH',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'TODO',
        stat: 'intellect',
        difficulty: 'MEDIUM',
        dueDate: '',
        habitType: 'BOTH',
      });
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Quest title cannot be empty!', 'error');
      return;
    }

    try {
      setLoading(true);
      if (taskToEdit) {
        const res = await updateTask(taskToEdit._id, formData);
        if (res.success) {
          addToast('Quest updated on the adventurer ledger!', 'success');
          onTaskSaved(res.task, true);
          onClose();
        }
      } else {
        const res = await createTask(formData);
        if (res.success) {
          addToast('New quest posted to the board!', 'success');
          onTaskSaved(res.task, false);
          onClose();
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save quest', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedDiff = DIFFICULTY_CONFIG[formData.difficulty] || DIFFICULTY_CONFIG.MEDIUM;
  const selectedStatInfo = STAT_CONFIG[formData.stat] || STAT_CONFIG.intellect;

  return (
    <RetroModal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Quest' : 'Post New Quest'}
      icon={Scroll}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        {/* Quest Title */}
        <div>
          <label className="block font-pixel text-[11px] text-amber-300 mb-1.5 uppercase">
            Quest Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Code 2 hours of React, 30 Push-ups, Drink 2L water"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-100 font-medium placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        {/* Quest Description */}
        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1 uppercase">
            Quest Description (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Brief details or criteria for quest completion..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none"
          />
        </div>

        {/* Quest Type */}
        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1.5 uppercase">
            Quest Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'TODO', label: 'To-Do Quest' },
              { id: 'DAILY', label: 'Daily Ritual' },
              { id: 'HABIT', label: 'Habit (+/-)' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, type: type.id })}
                className={`
                  py-2 px-2 font-pixel text-[10px] border-2 uppercase transition-all
                  ${
                    formData.type === type.id
                      ? 'bg-purple-900 border-purple-400 text-purple-200 shadow-pixel-sm'
                      : 'bg-dungeon-950 border-dungeon-800 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Habit Direction (if type is HABIT) */}
        {formData.type === 'HABIT' && (
          <div>
            <label className="block font-pixel text-[10px] text-slate-400 mb-1.5 uppercase">
              Habit Nature
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'POSITIVE', label: 'Positive (+)' },
                { id: 'NEGATIVE', label: 'Negative (-)' },
                { id: 'BOTH', label: 'Dual (+/-)' },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, habitType: h.id })}
                  className={`
                    py-1.5 px-1 font-pixel text-[9px] border-2 uppercase
                    ${
                      formData.habitType === h.id
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                        : 'bg-dungeon-950 border-dungeon-800 text-slate-400'
                    }
                  `}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Character Attribute Linked */}
        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1.5 uppercase">
            Character Stat Leveled Up
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(STAT_CONFIG).map(([key, stat]) => {
              const isSelected = formData.stat === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, stat: key })}
                  className={`
                    p-2 border-2 text-left transition-all flex flex-col justify-between
                    ${
                      isSelected
                        ? 'border-amber-400 shadow-pixel-sm'
                        : 'border-dungeon-800 hover:border-dungeon-700 bg-dungeon-950'
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? stat.bg : undefined,
                  }}
                >
                  <span className="font-pixel text-[10px]" style={{ color: stat.color }}>
                    {stat.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans mt-0.5 line-clamp-1">
                    {stat.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Tier */}
        <div>
          <label className="block font-pixel text-[10px] text-slate-400 mb-1.5 uppercase">
            Difficulty Tier & Bounty
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {Object.entries(DIFFICULTY_CONFIG).map(([key, diff]) => {
              const isSelected = formData.difficulty === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: key })}
                  className={`
                    py-2 px-1 border-2 text-center transition-all font-pixel text-[9px] uppercase
                    ${
                      isSelected
                        ? 'shadow-pixel-sm font-bold'
                        : 'border-dungeon-800 bg-dungeon-950 text-slate-400 hover:text-slate-200'
                    }
                  `}
                  style={{
                    borderColor: isSelected ? diff.color : undefined,
                    color: isSelected ? diff.color : undefined,
                    backgroundColor: isSelected ? 'rgba(0,0,0,0.5)' : undefined,
                  }}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>

          {/* Reward Preview Card */}
          <div className="mt-2 p-2 bg-dungeon-950 border border-dungeon-800 flex items-center justify-between text-[10px] font-pixel text-slate-300">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Yields:</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-purple-300">+{selectedDiff.xp} XP</span>
              <span className="text-amber-400">+{selectedDiff.gold} Gold</span>
              {selectedDiff.gems > 0 && <span className="text-sky-400">+{selectedDiff.gems} Gem</span>}
              <span style={{ color: selectedStatInfo.color }}>
                +Stat ({selectedStatInfo.short})
              </span>
            </div>
          </div>
        </div>

        {/* Due Date (Optional) */}
        {formData.type !== 'HABIT' && (
          <div>
            <label className="block font-pixel text-[10px] text-slate-400 mb-1 uppercase">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-1.5 bg-dungeon-950 border-2 border-dungeon-800 focus:border-amber-400 text-slate-300 text-xs focus:outline-none"
            />
          </div>
        )}

        {/* Submit & Cancel */}
        <div className="pt-3 border-t border-dungeon-800 flex justify-end gap-2">
          <RetroButton variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </RetroButton>
          <RetroButton variant="gold" size="sm" type="submit" disabled={loading}>
            {loading ? 'Posting...' : taskToEdit ? 'Save Changes' : 'Accept Quest'}
          </RetroButton>
        </div>
      </form>
    </RetroModal>
  );
};

export default TaskFormModal;
