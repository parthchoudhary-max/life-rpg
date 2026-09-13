import React from 'react';

export const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse" aria-label="Loading content..." role="status">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 bg-dungeon-900 border-2 border-dungeon-800 shadow-pixel flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 w-full">
            {type === 'task' && (
              <div className="w-6 h-6 bg-dungeon-800 border border-dungeon-700 shrink-0" />
            )}
            <div className="space-y-2 w-full max-w-md">
              <div className="h-3.5 bg-dungeon-800 w-3/4 rounded-none" />
              <div className="h-2.5 bg-dungeon-800/60 w-1/2 rounded-none" />
            </div>
          </div>
          <div className="h-6 w-16 bg-dungeon-800 border border-dungeon-700 shrink-0" />
        </div>
      ))}
      <span className="sr-only">Loading quest details...</span>
    </div>
  );
};

export default SkeletonLoader;
