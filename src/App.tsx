import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Sparkles, RefreshCw, Github, AlertTriangle, Clock } from 'lucide-react';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisView } from './components/AnalysisView';
import { HistorySidebar } from './components/HistorySidebar';
import { analyzeDecision } from './lib/gemini';
import { DecisionAnalysis, HistoryItem } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('decision_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  // Save history when it changes
  useEffect(() => {
    localStorage.setItem('decision_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async (question: string, userPriorities?: Record<string, number>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeDecision(question, userPriorities);
      setAnalysis(result);
      
      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        analysis: result
      };
      setHistory(prev => [...prev, newItem]);
    } catch (err) {
      console.error(err);
      setError('I encountered an error while analyzing your decision. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setAnalysis(item.analysis);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen grid-bg">
      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={selectHistoryItem}
        onDelete={deleteHistoryItem}
      />

      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none">DecideSmart AI</h1>
              <p className="text-[10px] font-mono tracking-widest text-brand-secondary">BETA V1.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-brand-secondary transition-colors">Methodology</a>
            </nav>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 text-sm font-medium hover:bg-black/5 px-4 py-2 rounded-full transition-all"
              >
                <Clock className="w-4 h-4" /> <span className="hidden sm:inline">History</span>
              </button>
              {analysis && (
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 text-sm font-medium bg-black/5 hover:bg-black/10 px-4 py-2 rounded-full transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <AnimatePresence mode="wait">
          {!analysis && !isLoading ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-brand-accent/30 text-brand-primary px-4 py-1.5 rounded-full mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest font-semibold">Intelligent Choice Assistant</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] max-w-4xl mx-auto">
                Decide with structured <span className="italic font-light">reasoning.</span>
              </h1>
              <p className="text-xl text-brand-secondary max-w-2xl mx-auto mb-12">
                Unbiased, data-driven frameworks for your most difficult life choices. Powered by advanced probability estimation.
              </p>
              <DecisionForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          ) : isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-black/5 border-t-black rounded-full animate-spin"></div>
                <Brain className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
              </div>
              <h2 className="mt-8 text-2xl font-bold font-display">Crunching Probabilities</h2>
              <p className="text-brand-secondary mt-2 max-w-xs mx-auto">
                Building structured reasoning modules and estimating success rates for each outcome...
              </p>
            </motion.div>
          ) : analysis ? (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnalysisView analysis={analysis} />
            </motion.div>
          ) : null}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center justify-center gap-2 max-w-md mx-auto"
            >
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer">
            <Brain className="w-5 h-5" />
            <span className="font-bold text-sm">DecideSmart AI</span>
          </div>
          <p className="text-xs text-brand-secondary font-mono tracking-widest text-center md:text-left">
            © 2026 DECIDESMART CO. • ALL PROBABILITIES ARE ESTIMATED MODELS.
          </p>
          <div className="flex gap-6">
            <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
