import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';

export default function ConfidenceIndicator({ 
  confidenceScore, 
  masteryLevel, 
  grapheme 
}) {
  const getColorScheme = () => {
    if (confidenceScore >= 80) return { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', ring: 'ring-green-200' };
    if (confidenceScore >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-200' };
    if (confidenceScore >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', ring: 'ring-yellow-200' };
    return { bg: 'bg-gray-400', text: 'text-gray-600 dark:text-gray-400', ring: 'ring-gray-200' };
  };

  const getMasteryIcon = () => {
    switch(masteryLevel) {
      case 'mastered': return <Trophy className="w-5 h-5" />;
      case 'proficient': return <Star className="w-5 h-5" />;
      case 'practicing': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getMasteryLabel = () => {
    switch(masteryLevel) {
      case 'mastered': return 'Mastered!';
      case 'proficient': return 'Proficient';
      case 'practicing': return 'Practicing';
      case 'learning': return 'Learning';
      default: return 'Not Started';
    }
  };

  const colors = getColorScheme();

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-gray-100 dark:border-slate-700 shadow-sm">
      {/* Grapheme Display */}
      <div className="text-5xl text-gray-900 dark:text-white" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
        {grapheme}
      </div>

      {/* Progress Circle */}
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200 dark:text-slate-700"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className={colors.bg.replace('bg-', 'text-')}
            initial={{ strokeDasharray: `0 ${2 * Math.PI * 32}` }}
            animate={{ 
              strokeDasharray: `${(confidenceScore / 100) * 2 * Math.PI * 32} ${2 * Math.PI * 32}` 
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${colors.text}`}>
            {Math.round(confidenceScore)}
          </span>
        </div>
      </div>

      {/* Mastery Info */}
      <div className="flex-1">
        <div className={`flex items-center gap-2 mb-1 ${colors.text}`}>
          {getMasteryIcon()}
          <span className="font-semibold text-sm">{getMasteryLabel()}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${colors.bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidenceScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}