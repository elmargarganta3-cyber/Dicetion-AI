import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Settings2, DollarSign, Heart, ShieldAlert, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DecisionFormProps {
  onAnalyze: (question: string, priorities: Record<string, number>) => void;
  isLoading: boolean;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({ onAnalyze, isLoading }) => {
  const [question, setQuestion] = useState('');
  const [showPriorities, setShowPriorities] = useState(false);
  const [priorities, setPriorities] = useState({
    Money: 3,
    Happiness: 5,
    Risk: 2,
    Time: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onAnalyze(question, priorities);
    }
  };

  const priorityIcons: Record<string, any> = {
    Money: <DollarSign className="w-3 h-3" />,
    Happiness: <Heart className="w-3 h-3" />,
    Risk: <ShieldAlert className="w-3 h-3" />,
    Time: <Hourglass className="w-3 h-3" />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative group mb-4">
          <div className="absolute -inset-1 bg-gradient-to-r from-black/5 to-black/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass-panel p-2 flex items-center gap-2">
            <div className="pl-4">
              <Sparkles className="w-5 h-5 text-brand-secondary" />
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What strategic decision are you facing?"
              className="flex-1 bg-transparent py-4 outline-none text-lg placeholder:text-brand-secondary/50 font-display"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPriorities(!showPriorities)}
              className={`p-2 rounded-xl transition-colors ${showPriorities ? 'bg-black text-white' : 'hover:bg-black/5'}`}
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="bg-brand-primary text-white p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showPriorities && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-panel p-6 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-sm">Prioritize what matters</h3>
                  <span className="text-[10px] font-mono text-brand-secondary uppercase tracking-widest">Adjust Weights (1-5)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(priorities).map(([key, value]) => (
                    <div key={key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium flex items-center gap-2">
                          <span className="p-1 bg-black/5 rounded">{priorityIcons[key]}</span>
                          {key}
                        </label>
                        <span className="font-mono text-xs font-bold">{value}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value}
                        onChange={(e) => setPriorities(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {['Move to a new city?', 'Buy a house now?', 'Learn Python or AI?'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuestion(suggestion);
              onAnalyze(suggestion, priorities);
            }}
            disabled={isLoading}
            className="text-[10px] font-mono uppercase tracking-wider text-brand-secondary hover:text-brand-primary border border-black/5 hover:border-black/20 px-3 py-1.5 rounded-full transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
