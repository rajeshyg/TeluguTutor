import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TransliterationChallenge({ 
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
    const correct = option === targetGrapheme.transliteration;
    
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
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">What is the sound of this letter?</p>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl p-8 shadow-lg border border-blue-100 dark:border-blue-800">
          <p className="text-8xl text-blue-900 dark:text-blue-100 font-bold" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
            {targetGrapheme.glyph}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
        {options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !showResult && handleSelect(option)}
            disabled={showResult}
            className={`
              relative p-6 rounded-2xl border-4 transition-all duration-300
              ${selected === option
                ? isCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-400 scale-105'
                  : 'border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400 scale-95'
                : 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:scale-105'
              }
              ${showResult && option === targetGrapheme.transliteration && selected !== option
                ? 'border-green-400 bg-green-50 dark:bg-green-900/30 dark:border-green-400'
                : ''
              }
              disabled:cursor-not-allowed
            `}
          >
            <div className="text-3xl font-bold text-gray-800 dark:text-slate-100">
              {option}
            </div>
            
            <AnimatePresence>
              {showResult && selected === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  className="absolute -top-3 -right-3"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500 fill-white dark:fill-slate-900" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 fill-white dark:fill-slate-900" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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