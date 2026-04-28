import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, XCircle, AlertTriangle, TrendingUp, Info, 
  HelpCircle, ArrowRight, Sparkles, Target, BarChart3, 
  DollarSign, Heart, ShieldAlert, Hourglass, Zap
} from 'lucide-react';
import { DecisionAnalysis, ProCon } from '../types';

interface AnalysisViewProps {
  analysis: DecisionAnalysis;
}

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className }) => {
  switch (category) {
    case 'Financial': return <DollarSign className={className} />;
    case 'Emotional': return <Heart className={className} />;
    case 'Risk': return <ShieldAlert className={className} />;
    case 'Time/Effort': return <Hourglass className={className} />;
    default: return <Zap className={className} />;
  }
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      {/* 1. Clarification section */}
      <motion.section variants={itemVariants} className="analysis-section">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-display text-xl font-bold">
            01
          </div>
          <div>
            <label className="label-small mb-0">Clarification & Intent</label>
            <h2 className="text-3xl font-bold tracking-tight">{analysis.decisionClarified.question}</h2>
          </div>
        </div>
        <p className="text-brand-secondary text-lg leading-relaxed max-w-3xl ml-16">
          The primary goal behind this decision is <span className="text-brand-primary font-medium">{analysis.decisionClarified.goal}</span>.
        </p>
      </motion.section>

      {/* 2-4. Options Analysis */}
      <motion.section variants={itemVariants} className="analysis-section">
        <label className="label-small space-x-2 flex items-center">
          <BarChart3 className="w-3 h-3" /> 
          <span>02-04. Comparative Framework & Weighted Scoring</span>
        </label>
        
        <div className="space-y-6 mt-8">
          {analysis.options.map((option, idx) => (
            <div key={option.id} className="glass-panel overflow-hidden bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left: Score & Factors */}
                <div className="lg:col-span-4 p-8 border-r border-black/5 bg-black/[0.01]">
                  <div className="flex justify-between items-start mb-6">
                    <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-mono text-xs">
                      {idx + 1}
                    </span>
                    <div className="text-right">
                      <div className="text-xs font-mono text-brand-secondary uppercase tracking-widest mb-1">Success Prob.</div>
                      <div className="text-3xl font-black font-display">{option.probability.successPercent}%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-8 leading-tight">{option.name}</h3>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-brand-secondary border-b border-black/5 pb-2 uppercase tracking-tighter">
                      <span>Strategy Factor</span>
                      <span>Weighted Score</span>
                    </div>
                    {option.factors.map((factor) => (
                      <div key={factor.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="flex items-center gap-1.5 opacity-70">
                            <CategoryIcon category={factor.name} className="w-3 h-3" />
                            {factor.name}
                          </span>
                          <span>{factor.rating}/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.rating * 10}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                            className="h-full bg-black"
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 flex justify-between items-end">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brand-secondary">Total Weighted Score</span>
                      <span className="text-2xl font-black font-display underline decoration-black/10 underline-offset-4">{option.totalScore}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Pros/Cons & Risks */}
                <div className="lg:col-span-8 p-8 flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Pros */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Categorized Pros
                      </div>
                      <div className="space-y-3">
                        {option.pros.map((pro, i) => (
                          <div key={i} className="group flex gap-3 text-sm leading-relaxed text-brand-primary/80">
                            <CategoryIcon category={pro.category} className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <p>{pro.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cons */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-rose-600 font-bold">
                        <XCircle className="w-3 h-3" /> Categorized Cons
                      </div>
                      <div className="space-y-3">
                        {option.cons.map((con, i) => (
                          <div key={i} className="group flex gap-3 text-sm leading-relaxed text-brand-primary/80">
                            <CategoryIcon category={con.category} className="w-4 h-4 mt-0.5 text-rose-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <p>{con.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-black/5">
                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Outcome Logic & Risk Guard
                        </div>
                        <div className="flex gap-2">
                          {option.probability.risks.map((r, i) => (
                            <span key={i} className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-800 italic uppercase">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-amber-900/70 italic leading-relaxed font-medium">
                        "{option.probability.explanation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5. Recommendation */}
      <motion.section variants={itemVariants} className="analysis-section bg-black text-white p-12 rounded-[2.5rem] mt-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/20 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[80px] -ml-32 -mb-32 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
          <div className="shrink-0 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <Target className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <label className="label-small text-white/40 mb-4 block">
              05. Strategic Recommendation
            </label>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-[1.1]">
              {analysis.recommendation.bestOption}
            </h2>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm max-w-3xl">
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light italic">
                "{analysis.recommendation.reasoning}"
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Reasoning Summary */}
      <motion.section variants={itemVariants} className="analysis-section flex flex-col md:flex-row gap-8 items-center text-center md:text-left py-20">
        <div className="w-24 h-24 shrink-0 rounded-full bg-brand-accent/50 flex items-center justify-center p-6 border border-black/5">
          <Brain className="w-full h-full opacity-60" />
        </div>
        <div className="max-w-2xl">
          <label className="label-small">06. Executive Summary (الأفضل)</label>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-brand-primary leading-tight">
            {analysis.reasoningSummary}
          </p>
        </div>
      </motion.section>

      {/* 7. Follow-up Questions */}
      <motion.section variants={itemVariants} className="analysis-section border-t border-black/5 pt-12">
        <div className="flex items-center gap-3 mb-8">
          <HelpCircle className="w-5 h-5 text-brand-secondary" />
          <h3 className="font-display font-bold text-xl uppercase tracking-tighter">Critical Self-Examination</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analysis.followUpQuestions.map((q, i) => (
            <div key={i} className="p-6 border border-black/5 rounded-2xl bg-white hover:bg-black hover:text-white transition-all group cursor-help shadow-sm hover:shadow-xl hover:-translate-y-1">
              <span className="font-mono text-[10px] block mb-4 opacity-50">SCENARIO Q{i+1}</span>
              <p className="font-medium leading-relaxed">
                {q}
              </p>
              <div className="mt-8 flex justify-end">
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

const Brain: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5M12 4.5A2.5 2.5 0 0 1 14.5 2M12 4.5V9M8 11a4 4 0 1 1 8 0M8 11V9a4 4 0 1 1 8 0M8 11c0 2.2 1.8 4 4 4s4-1.8 4-4" />
    <path d="M12 15v4c0 1.1-.9 2-2 2H8M12 15v4c0 1.1.9 2 2 2h2" />
    <path d="M14 9a2 2 0 1 1-4 0" />
  </svg>
);
