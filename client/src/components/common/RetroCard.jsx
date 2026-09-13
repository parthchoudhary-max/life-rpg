import React from 'react';

export const RetroCard = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  headerClassName = '',
  highlight = false,
  ...props
}) => {
  return (
    <div
      className={`
        relative bg-dungeon-900 border-2 
        ${highlight ? 'border-amber-400 shadow-pixel-gold' : 'border-dungeon-border shadow-pixel'}
        p-4 transition-all duration-150
        ${className}
      `}
      {...props}
    >
      {(title || Icon || action) && (
        <div className={`flex items-center justify-between pb-3 mb-3 border-b border-dungeon-800 ${headerClassName}`}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 bg-dungeon-800 border border-dungeon-700 text-amber-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="font-pixel text-xs md:text-sm text-slate-100 uppercase">{title}</h3>}
              {subtitle && <p className="text-[11px] text-slate-400 font-sans mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default RetroCard;
