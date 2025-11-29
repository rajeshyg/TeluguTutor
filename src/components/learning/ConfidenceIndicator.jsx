import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';

export default function ConfidenceIndicator({ 
  confidenceScore, 
  masteryLevel, 
  grapheme 
}) {
  const getColorScheme = () => {
    if (confidenceScore >= 80) return { bg: 'bg-success', text: 'text-success', ring: 'ring-success/30' };
    if (confidenceScore >= 60) return { bg: 'bg-primary', text: 'text-primary', ring: 'ring-primary/30' };
    if (confidenceScore >= 40) return { bg: 'bg-warning', text: 'text-warning', ring: 'ring-warning/30' };
    return { bg: 'bg-muted', text: 'text-muted-foreground', ring: 'ring-muted' };
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
    <div className="flex items-center gap-4 p-4 bg-card rounded-xl border-2 border-border shadow-sm">
      {/* Grapheme Display */}
      <div className="text-5xl text-card-foreground" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
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
            className="text-muted"
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
        <div className="w-full bg-muted rounded-full h-2">
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