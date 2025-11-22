import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DecomposeRebuild({ 
  targetGrapheme, 
  onAnswer, 
  onTimeRecorded 
}) {
  const [componentTiles, setComponentTiles] = useState([]);
  const [placedTiles, setPlacedTiles] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Shuffle components
    if (targetGrapheme && targetGrapheme.components) {
      const shuffled = [...targetGrapheme.components].sort(() => Math.random() - 0.5);
      setComponentTiles(shuffled.map((comp, idx) => ({ id: `tile-${idx}`, text: comp })));
    }
    setPlacedTiles([]);
    setShowResult(false);
    setShowHint(false);
  }, [targetGrapheme]);

  const handleDrop = (tileId) => {
    const tile = componentTiles.find(t => t.id === tileId);
    if (tile && !placedTiles.find(p => p.id === tileId)) {
      setPlacedTiles([...placedTiles, tile]);
    }
  };

  const handleRemove = (tileId) => {
    setPlacedTiles(placedTiles.filter(t => t.id !== tileId));
  };

  const handleCheck = () => {
    const responseTime = Date.now() - startTime;
    const userAnswer = placedTiles.map(t => t.text).join('');
    const correct = userAnswer === targetGrapheme.components.join('');
    
    setIsCorrect(correct);
    setShowResult(true);
    onTimeRecorded(responseTime);
    
    setTimeout(() => {
      onAnswer(correct);
    }, 2000);
  };

  const handleReset = () => {
    setPlacedTiles([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Build the letter for the sound:</p>
        <div className="bg-gradient-to-br from-coral-50 to-yellow-50 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-3xl p-8 shadow-lg border border-orange-100 dark:border-orange-800">
          <div className="text-6xl font-bold text-purple-900 dark:text-purple-100">
            {targetGrapheme.transliteration}
          </div>
        </div>
      </motion.div>

      {/* Build Zone */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border-4 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl p-6 min-h-[120px] w-full max-w-md mb-6 flex items-center justify-center gap-2 flex-wrap">
        {placedTiles.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-lg">Tap components below to build</p>
        ) : (
          placedTiles.map((tile) => (
            <motion.button
              key={tile.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRemove(tile.id)}
              className="bg-white dark:bg-slate-800 border-2 border-purple-400 dark:border-purple-600 rounded-xl px-6 py-4 text-4xl hover:bg-red-50 dark:hover:bg-red-900/30 active:bg-red-100 dark:active:bg-red-900/50 transition-colors text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              {tile.text}
            </motion.button>
          ))
        )}
      </div>

      {/* Component Tiles */}
      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-md">
        {componentTiles.map((tile) => {
          const isPlaced = placedTiles.find(p => p.id === tile.id);
          return (
            <motion.button
              key={tile.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => !isPlaced && !showResult && handleDrop(tile.id)}
              disabled={isPlaced || showResult}
              className={`
                p-6 rounded-xl border-3 text-4xl transition-all
                ${isPlaced 
                  ? 'bg-gray-100 dark:bg-slate-800/50 border-gray-300 dark:border-slate-700 opacity-40 cursor-not-allowed text-gray-400 dark:text-gray-600' 
                  : 'bg-white dark:bg-slate-800 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 active:scale-95 cursor-pointer text-gray-900 dark:text-gray-100'
                }
                ${showResult ? 'cursor-not-allowed' : ''}
              `}
              style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
            >
              {tile.text}
            </motion.button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleReset}
          variant="outline"
          disabled={placedTiles.length === 0 || showResult}
          className="gap-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        
        <Button
          onClick={() => setShowHint(!showHint)}
          variant="outline"
          disabled={showResult}
          className="gap-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Lightbulb className="w-4 h-4" />
          Hint
        </Button>

        <Button
          onClick={handleCheck}
          disabled={placedTiles.length === 0 || showResult}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 gap-2 text-white"
        >
          <CheckCircle2 className="w-4 h-4" />
          Check
        </Button>
      </div>

      {showHint && !showResult && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4 text-center"
        >
          <p className="text-sm text-gray-700 dark:text-yellow-200">
            The correct order has <strong>{targetGrapheme.components.length}</strong> parts
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-6 text-2xl font-bold ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {isCorrect ? '🎉 Perfect!' : '❌ Not quite right'}
            {!isCorrect && (
               <div className="text-4xl mt-2 text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                 {targetGrapheme.glyph}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
