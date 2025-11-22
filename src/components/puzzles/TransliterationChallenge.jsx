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
        <p className="text-lg text-gray-600 mb-4">What is the sound of this letter?</p>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-lg">
          <p className="text-8xl text-blue-900 font-bold" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
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
                  ? 'border-green-500 bg-green-50 scale-105'
                  : 'border-red-500 bg-red-50 scale-95'
                : 'border-blue-200 bg-white hover:border-blue-400 hover:scale-105'
              }
              ${showResult && option === targetGrapheme.transliteration && selected !== option
                ? 'border-green-400 bg-green-50'
                : ''
              }
              disabled:cursor-not-allowed
            `}
          >
            <div className="text-3xl font-bold text-gray-800">
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
                    <CheckCircle2 className="w-8 h-8 text-green-500 fill-white" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 fill-white" />
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
          className={`mt-8 text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
        >
          {isCorrect ? '🎉 Correct!' : '❌ Try again!'}
        </motion.div>
      )}
    </div>
  );
}