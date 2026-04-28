import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, X, Trash2, ChevronRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect, 
  onDelete 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-secondary" />
                <h2 className="font-display font-bold text-xl">Decision History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <Clock className="w-12 h-12 mb-4" />
                  <p className="font-display text-lg">No history yet</p>
                  <p className="text-xs font-mono uppercase tracking-widest mt-1">Analyze a decision to see it here</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative glass-panel p-4 hover:border-black/20 transition-all cursor-pointer"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-rose-500 rounded-md transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-display font-bold text-sm leading-snug group-hover:text-brand-primary line-clamp-2">
                      {item.analysis.decisionClarified.question}
                    </h3>
                    <div className="mt-3 flex items-center text-[10px] font-mono font-bold text-brand-secondary">
                      VIEW ANALYSIS <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              ).reverse()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
