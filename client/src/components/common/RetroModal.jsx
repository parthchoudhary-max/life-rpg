import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export const RetroModal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
  icon: Icon,
}) => {
  const { playClick } = useAudio();
  const modalRef = useRef(null);

  // Close on Escape key & focus trapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        playClick();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, playClick]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playClick();
              onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`
              relative w-full ${maxWidth} z-10
              bg-dungeon-900 border-4 border-dungeon-borderHighlight
              shadow-pixel-lg text-slate-200 overflow-hidden
            `}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-dungeon-800 border-b-2 border-dungeon-border">
              <div className="flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-amber-400" />}
                <h3 id="modal-headline" className="font-pixel text-xs sm:text-sm text-amber-300 uppercase tracking-wide">
                  {title}
                </h3>
              </div>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="p-1 border border-dungeon-700 bg-dungeon-900 hover:bg-rose-900 hover:border-rose-500 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RetroModal;
