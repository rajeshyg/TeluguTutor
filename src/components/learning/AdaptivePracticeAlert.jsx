import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdaptivePracticeAlert({ 
  strugglingGraphemes, 
  onStartPractice, 
  onDismiss 
}) {
  if (!strugglingGraphemes || strugglingGraphemes.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 shadow-2xl text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Extra Practice Available!
            </h3>
            <p className="text-sm text-white/90 mb-4">
              Let's focus on {strugglingGraphemes.length} letter{strugglingGraphemes.length > 1 ? 's' : ''} that need more practice:
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {strugglingGraphemes.slice(0, 3).map((g, idx) => (
                <div 
                  key={idx}
                  className="bg-white/20 px-3 py-1 rounded-lg text-2xl"
                  style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}
                >
                  {g.glyph}
                </div>
              ))}
              {strugglingGraphemes.length > 3 && (
                <div className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                  +{strugglingGraphemes.length - 3} more
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onStartPractice}
                className="bg-card text-primary hover:bg-card/90 flex-1"
              >
                Start Practice
              </Button>
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}