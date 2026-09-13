import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, Sparkles, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Add toast notification
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add floating combat/XP text
  const addFloatingText = useCallback((text, options = {}) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const {
      color = '#fbbf24',
      x = window.innerWidth / 2 - 60 + (Math.random() * 60 - 30),
      y = window.innerHeight / 2 - 50 + (Math.random() * 40 - 20),
    } = options;

    setFloatingTexts((prev) => [...prev, { id, text, color, x, y }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((f) => f.id !== id));
    }, 1500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, addFloatingText }}>
      {children}

      {/* Floating Combat / XP Text Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingTexts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.6, y: item.y, x: item.x }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.25, 1.1, 0.9],
                y: item.y - 80,
                x: item.x,
              }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="absolute font-pixel text-sm md:text-base font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              style={{ color: item.color }}
            >
              {item.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 16-Bit Toast Banner List */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isReward = toast.type === 'reward';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                className={`pointer-events-auto p-3.5 border-2 shadow-pixel flex items-start gap-3 text-xs md:text-sm font-pixel ${
                  isSuccess
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
                    : isError
                    ? 'bg-rose-950/95 border-rose-500 text-rose-200'
                    : isReward
                    ? 'bg-purple-950/95 border-purple-500 text-purple-200 shadow-pixel-xp'
                    : 'bg-dungeon-900/95 border-dungeon-borderHighlight text-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {isReward && <Sparkles className="w-4 h-4 text-purple-400" />}
                  {!isSuccess && !isError && !isReward && <Info className="w-4 h-4 text-sky-400" />}
                </div>
                <div className="flex-1 leading-relaxed">{toast.message}</div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-slate-400 hover:text-white transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
