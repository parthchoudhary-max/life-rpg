import React from 'react';
import { Keyboard, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-16 border-t-2 border-dungeon-800 bg-dungeon-950 py-6 text-center text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-pixel text-[10px] text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Life RPG Engine • 16-Bit Gamified Progression</span>
        </div>

        {/* Keyboard shortcut guide */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Keyboard className="w-3.5 h-3.5 text-purple-400" />
          <span>
            <kbd className="px-1.5 py-0.5 bg-dungeon-900 border border-dungeon-700 font-mono text-purple-300">Tab</kbd> / <kbd className="px-1.5 py-0.5 bg-dungeon-900 border border-dungeon-700 font-mono text-purple-300">Space</kbd> to navigate & slay tasks
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
