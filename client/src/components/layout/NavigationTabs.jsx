import React from 'react';
import { Scroll, Shield, Store, BookOpen } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const TABS = [
  { id: 'quests', label: 'Quests & Habits', icon: Scroll },
  { id: 'character', label: 'Character & Stats', icon: Shield },
  { id: 'shop', label: 'Merchant & Rewards', icon: Store },
  { id: 'logs', label: 'Logbook & History', icon: BookOpen },
];

export const NavigationTabs = ({ activeTab, onSelectTab, activeQuestCount }) => {
  const { playClick } = useAudio();

  return (
    <nav
      aria-label="Main Navigation Tabs"
      className="flex items-center gap-1.5 sm:gap-3 overflow-x-auto border-b-2 border-dungeon-800 pb-2 mb-6 scrollbar-none"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              playClick();
              onSelectTab(tab.id);
            }}
            role="tab"
            aria-selected={isActive}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 font-pixel text-xs whitespace-nowrap
              border-2 transition-all select-none
              ${
                isActive
                  ? 'bg-dungeon-800 text-amber-300 border-amber-400 shadow-pixel-gold translate-y-[-2px]'
                  : 'bg-dungeon-900/90 text-slate-400 border-dungeon-border hover:text-slate-200 hover:border-dungeon-borderHighlight hover:bg-dungeon-800/60 shadow-pixel-sm'
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>

            {tab.id === 'quests' && activeQuestCount > 0 && (
              <span className="ml-1 bg-purple-900 text-purple-200 border border-purple-400 px-1.5 py-0.2 text-[10px] rounded-none">
                {activeQuestCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default NavigationTabs;
