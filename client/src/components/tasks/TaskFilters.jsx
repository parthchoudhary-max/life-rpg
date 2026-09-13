import React from 'react';
import { Search, PlusCircle, Filter } from 'lucide-react';
import RetroButton from '../common/RetroButton';
import { STAT_CONFIG, DIFFICULTY_CONFIG } from '../../utils/leveling';

export const TaskFilters = ({
  activeType,
  onSelectType,
  selectedStat,
  onSelectStat,
  selectedDifficulty,
  onSelectDifficulty,
  searchQuery,
  onSearchChange,
  onOpenNewQuest,
}) => {
  return (
    <div className="space-y-3 mb-6 bg-dungeon-900 border-2 border-dungeon-border p-3 sm:p-4 shadow-pixel">
      {/* Top Row: Type Pills & New Quest Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'TODO', label: 'Quests (To-Do)' },
            { id: 'DAILY', label: 'Daily Rituals' },
            { id: 'HABIT', label: 'Habits (+/-)' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`
                px-3 py-1.5 font-pixel text-xs uppercase border-2 transition-all whitespace-nowrap
                ${
                  activeType === type.id
                    ? 'bg-purple-900 border-purple-400 text-purple-100 shadow-pixel-sm'
                    : 'bg-dungeon-800 border-dungeon-700 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {type.label}
            </button>
          ))}
        </div>

        <RetroButton
          variant="gold"
          size="sm"
          onClick={onOpenNewQuest}
          className="flex items-center justify-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Quest</span>
        </RetroButton>
      </div>

      {/* Bottom Row: Search, Attribute & Difficulty Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-dungeon-800">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-dungeon-950 border-2 border-dungeon-800 focus:border-purple-500 text-slate-200 text-xs font-sans placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        {/* Attribute Filter */}
        <div className="flex items-center gap-1.5 bg-dungeon-950 border-2 border-dungeon-800 px-2 py-1">
          <Filter className="w-3 h-3 text-slate-500" />
          <select
            value={selectedStat}
            onChange={(e) => onSelectStat(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            aria-label="Filter by attribute"
          >
            <option value="" className="bg-dungeon-900">All Attributes</option>
            {Object.entries(STAT_CONFIG).map(([key, info]) => (
              <option key={key} value={key} className="bg-dungeon-900">
                {info.label} ({info.short})
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 bg-dungeon-950 border-2 border-dungeon-800 px-2 py-1">
          <select
            value={selectedDifficulty}
            onChange={(e) => onSelectDifficulty(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            aria-label="Filter by difficulty"
          >
            <option value="" className="bg-dungeon-900">All Difficulties</option>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, info]) => (
              <option key={key} value={key} className="bg-dungeon-900">
                {info.label} ({info.xp} XP)
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
