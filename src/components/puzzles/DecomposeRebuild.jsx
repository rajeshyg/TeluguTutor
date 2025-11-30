import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { soundManager } from '@/utils/sounds';
import { Celebration, FloatingStars } from '@/components/learning/Celebration';

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
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Shuffle components
    if (targetGrapheme && targetGrapheme.components) {
      const shuffled = [...targetGrapheme.components].sort(() => Math.random() - 0.5);
      setComponentTiles(shuffled.map((comp, idx) => ({ id: `tile-${idx}`, text: comp })));
    }
    setPlacedTiles([]);
    setShowResult(false);
    setShowHint(false);
    setShowCelebration(false);
  }, [targetGrapheme]);

  const handleDrop = (tileId) => {
    const tile = componentTiles.find(t => t.id === tileId);
    if (tile && !placedTiles.find(p => p.id === tileId)) {
      soundManager.playClick();
      setPlacedTiles([...placedTiles, tile]);
    }
  };

  const handleRemove = (tileId) => {
    soundManager.playClick();
    setPlacedTiles(placedTiles.filter(t => t.id !== tileId));
  };

  const handleCheck = () => {
    const responseTime = Date.now() - startTime;
    const userAnswer = placedTiles.map(t => t.text).join('');
    const correct = userAnswer === targetGrapheme.components.join('');
    
    setIsCorrect(correct);
    setShowResult(true);
    onTimeRecorded(responseTime);
    
    // Play appropriate sound
    if (correct) {
      soundManager.playSuccess();
      soundManager.playStar();
      setShowCelebration(true);
    } else {
      soundManager.playError();
    }
    
    setTimeout(() => {
      setShowCelebration(false);
      onAnswer(correct);
    }, 2000);
  };

  const handleReset = () => {
    soundManager.playClick();
    setPlacedTiles([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 relative">
      {/* Celebration effects */}
      <Celebration show={showCelebration} type="big" />
      <FloatingStars show={showCelebration} count={8} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8"
      >
        <p className="text-lg text-muted-foreground mb-4">Build the letter for the sound:</p>
        <div className="bg-secondary rounded-3xl p-8 shadow-lg border border-border">
          <div className="text-6xl font-bold text-foreground">
            {targetGrapheme.transliteration}
          </div>
        </div>
      </motion.div>

      {/* Build Zone */}
      <div className="bg-secondary border-4 border-dashed border-border rounded-2xl p-6 min-h-[120px] w-full max-w-md mb-6 flex items-center justify-center gap-2 flex-wrap">
        {placedTiles.length === 0 ? (
          <p className="text-muted-foreground text-lg">Tap components below to build</p>
        ) : (
          placedTiles.map((tile) => (
            <motion.button
              key={tile.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleRemove(tile.id)}
              className="bg-card border-2 border-primary rounded-xl px-6 py-4 text-4xl hover:bg-destructive/10 active:bg-destructive/20 transition-colors text-card-foreground"
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
                  ? 'bg-muted border-border opacity-40 cursor-not-allowed text-muted-foreground' 
                  : 'bg-card border-border hover:border-primary active:scale-95 cursor-pointer text-card-foreground'
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
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        
        <Button
          onClick={() => setShowHint(!showHint)}
          variant="outline"
          disabled={showResult}
          className="gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          Hint
        </Button>

        <Button
          onClick={handleCheck}
          disabled={placedTiles.length === 0 || showResult}
          className="bg-success hover:bg-success/90 gap-2 text-success-foreground"
        >
          <CheckCircle2 className="w-4 h-4" />
          Check
        </Button>
      </div>

      {showHint && !showResult && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 bg-accent border-2 border-border rounded-lg p-4 text-center"
        >
          <p className="text-sm text-accent-foreground">
            The correct order has <strong>{targetGrapheme.components.length}</strong> parts
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`mt-6 text-2xl font-bold ${isCorrect ? 'text-success' : 'text-error'}`}
          >
            {isCorrect ? '🎉 Perfect!' : '❌ Not quite right'}
            {!isCorrect && (
               <div className="text-4xl mt-2 text-foreground" style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                 {targetGrapheme.glyph}
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
