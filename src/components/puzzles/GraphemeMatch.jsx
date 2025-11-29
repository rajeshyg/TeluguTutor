import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export default function GraphemeMatch({ 
  targetGrapheme, 
  options, 
  onAnswer, 
  onTimeRecorded 
}) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());

  const handleSelect = (option) => {
    const responseTime = Date.now() - startTime;
    const correct = option.glyph === targetGrapheme.glyph;
    
    setSelected(option);
    setIsCorrect(correct);
    setShowResult(true);
    
    onTimeRecorded(responseTime);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <p className="text-lg text-muted-foreground mb-4">Find the letter that sounds like:</p>
        <div className="bg-secondary rounded-3xl p-8 shadow-lg border border-border">
          <p className="text-6xl text-foreground font-bold">
            {targetGrapheme.transliteration}
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            ({targetGrapheme.transliteration_simple})
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !showResult && handleSelect(option)}
            disabled={showResult}
            className={`
              relative p-8 rounded-2xl border-4 transition-all duration-300
              ${selected?.id === option.id
                ? isCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400 scale-105'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400 scale-95'
                : 'border-border bg-card hover:border-primary hover:scale-105'
              }
              ${showResult && option.glyph === targetGrapheme.glyph && selected?.id !== option.id
                ? 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-400'
                : ''
              }
              disabled:cursor-not-allowed
            `}
          >
            <div className="text-7xl text-foreground" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
              {option.glyph}
            </div>
            
            <AnimatePresence>
              {showResult && selected?.id === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  className="absolute -top-3 -right-3"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-12 h-12 text-green-500 fill-card" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500 fill-card" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {showResult && option.glyph === targetGrapheme.glyph && selected?.id !== option.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 -right-3"
              >
                <Sparkles className="w-10 h-10 text-yellow-500 fill-yellow-400" />
              </motion.div>
            )}
            
            {showResult && (
              <p className="text-sm text-muted-foreground mt-2">
                {option.transliteration}
              </p>
            )}
          </motion.button>
        ))}
      </div>

      {showResult && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mt-8 text-2xl font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {isCorrect ? '🎉 Correct!' : '❌ Try again!'}
        </motion.div>
      )}
    </div>
  );
}