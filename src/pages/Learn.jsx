import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GraphemeMatch from '@/components/puzzles/GraphemeMatch';
import DecomposeRebuild from '@/components/puzzles/DecomposeRebuild';
import TransliterationChallenge from '@/components/puzzles/TransliterationChallenge';
import { useAuth } from '@/contexts/AuthContext';
import { soundManager } from '@/utils/sounds';
import { Celebration } from '@/components/learning/Celebration';

const PUZZLE_TYPES = ['grapheme_match', 'decompose_rebuild', 'transliteration'];

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Learn() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [currentModule, setCurrentModule] = useState('hallulu');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentGrapheme, setCurrentGrapheme] = useState(null);
  const [puzzleType, setPuzzleType] = useState('grapheme_match');
  const [sessionStart, setSessionStart] = useState(Date.now());
  const [stars, setStars] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [orderedGraphemes, setOrderedGraphemes] = useState([]);
  const [showModuleComplete, setShowModuleComplete] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const module = urlParams.get('module');
    if (module) setCurrentModule(module);
  }, []);

  const { data: graphemes = [], isLoading } = useQuery({
    queryKey: ['graphemes', currentModule],
    queryFn: async () => {
      const all = await base44.entities.TeluguGrapheme.filter({ module: currentModule });
      return all.sort((a, b) => a.difficulty - b.difficulty);
    },
    enabled: !!currentModule
  });

  const { data: masteryData = [] } = useQuery({
    queryKey: ['mastery', user?.email, currentModule],
    queryFn: async () => {
      if (!user) return [];
      return await base44.entities.GraphemeMastery.filter({ user_email: user.email });
    },
    enabled: !!user
  });

  // Smart ordering: prioritize unanswered and failed questions, then randomize
  useEffect(() => {
    if (graphemes.length > 0 && masteryData !== undefined) {
      // Create a map of grapheme mastery for quick lookup
      const masteryMap = new Map();
      masteryData.forEach(m => masteryMap.set(m.grapheme_id, m));
      
      // Categorize graphemes
      const unanswered = []; // Never attempted
      const failed = [];     // Attempted but low accuracy/struggling
      const practiced = [];  // Already practiced with decent accuracy
      
      graphemes.forEach(g => {
        const mastery = masteryMap.get(g.id);
        if (!mastery || mastery.total_attempts === 0) {
          unanswered.push(g);
        } else if (mastery.accuracy_rate < 50 || mastery.needs_adaptive_practice || mastery.struggle_count >= 2) {
          failed.push(g);
        } else {
          practiced.push(g);
        }
      });
      
      // Shuffle each category
      const shuffledUnanswered = shuffleArray(unanswered);
      const shuffledFailed = shuffleArray(failed);
      const shuffledPracticed = shuffleArray(practiced);
      
      // Combine: unanswered first, then failed, then practiced
      const smartOrder = [...shuffledUnanswered, ...shuffledFailed, ...shuffledPracticed];
      
      setOrderedGraphemes(smartOrder);
      setCurrentPuzzleIndex(0);
    }
  }, [graphemes, masteryData]);

  const recordSessionMutation = useMutation({
    mutationFn: async ({ graphemeId, success, time, attempts }) => {
      await base44.entities.PracticeSession.create({
        user_email: user.email,
        grapheme_id: graphemeId,
        puzzle_type: puzzleType,
        was_successful: success,
        response_time: time,
        attempts_taken: attempts,
        is_adaptive_practice: false,
        session_date: new Date().toISOString()
      });
    }
  });

  const updateMasteryMutation = useMutation({
    mutationFn: async ({ graphemeId, success, time }) => {
      const existing = masteryData.find(m => m.grapheme_id === graphemeId);
      
      if (existing) {
        const newTotal = existing.total_attempts + 1;
        const newSuccessful = existing.successful_attempts + (success ? 1 : 0);
        const newAccuracy = (newSuccessful / newTotal) * 100;
        const newStruggle = success ? 0 : existing.struggle_count + 1;
        const newConsecutive = success ? existing.consecutive_successes + 1 : 0;
        
        // Calculate confidence score (multi-factor)
        const accuracyFactor = newAccuracy * 0.4;
        const consistencyFactor = Math.min(newConsecutive * 5, 30);
        const speedFactor = time < 3000 ? 20 : time < 5000 ? 10 : 0;
        const retentionFactor = 10; // Would track days between practices
        
        const confidenceScore = Math.min(100, 
          accuracyFactor + consistencyFactor + speedFactor + retentionFactor
        );
        
        let masteryLevel = 'learning';
        if (confidenceScore >= 90) masteryLevel = 'mastered';
        else if (confidenceScore >= 70) masteryLevel = 'proficient';
        else if (confidenceScore >= 40) masteryLevel = 'practicing';
        
        await base44.entities.GraphemeMastery.update(existing.id, {
          total_attempts: newTotal,
          successful_attempts: newSuccessful,
          accuracy_rate: newAccuracy,
          confidence_score: confidenceScore,
          consecutive_successes: newConsecutive,
          struggle_count: newStruggle,
          needs_adaptive_practice: newStruggle >= 3,
          mastery_level: masteryLevel,
          last_practiced: new Date().toISOString(),
          average_response_time: ((existing.average_response_time || 0) * existing.total_attempts + time) / newTotal
        });
      } else {
        await base44.entities.GraphemeMastery.create({
          user_email: user.email,
          grapheme_id: graphemeId,
          total_attempts: 1,
          successful_attempts: success ? 1 : 0,
          accuracy_rate: success ? 100 : 0,
          confidence_score: success ? 30 : 10,
          consecutive_successes: success ? 1 : 0,
          struggle_count: success ? 0 : 1,
          needs_adaptive_practice: false,
          mastery_level: 'learning',
          last_practiced: new Date().toISOString(),
          average_response_time: time
        });
      }
      
      queryClient.invalidateQueries(['mastery']);
      queryClient.invalidateQueries(['strugglingGraphemes']);
    }
  });

  useEffect(() => {
    if (orderedGraphemes.length > 0 && currentPuzzleIndex < orderedGraphemes.length) {
      const grapheme = orderedGraphemes[currentPuzzleIndex];
      setCurrentGrapheme(grapheme);
      
      // Smart puzzle type selection based on grapheme complexity
      const availableTypes = [];
      
      // GraphemeMatch works for all graphemes
      availableTypes.push('grapheme_match');
      
      // DecomposeRebuild only for multi-component graphemes
      // Ensure components are actually different from the glyph itself and there are at least 2
      if (grapheme.components && grapheme.components.length > 1) {
        availableTypes.push('decompose_rebuild');
      }
      
      // Transliteration works for all
      availableTypes.push('transliteration');
      
      // Weighted random selection
      const rand = Math.random();
      if (availableTypes.includes('decompose_rebuild') && rand > 0.6) {
        setPuzzleType('decompose_rebuild');
      } else if (availableTypes.includes('transliteration') && rand > 0.3) {
        setPuzzleType('transliteration');
      } else {
        setPuzzleType('grapheme_match');
      }
    }
  }, [currentPuzzleIndex, orderedGraphemes]);

  const handleAnswer = async (correct) => {
    if (!currentGrapheme || !user) return;
    
    if (correct) {
      setStars(prev => prev + 3);
      // Update stars in profile
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      if (profiles.length > 0) {
        const currentStars = profiles[0].total_stars || 0;
        await base44.entities.UserProfile.update(user.email, {
          total_stars: currentStars + 3
        });
      }
    }
    
    await recordSessionMutation.mutateAsync({
      graphemeId: currentGrapheme.id,
      success: correct,
      time: responseTime,
      attempts: 1
    });
    
    await updateMasteryMutation.mutateAsync({
      graphemeId: currentGrapheme.id,
      success: correct,
      time: responseTime
    });
    
    setTimeout(() => {
      if (currentPuzzleIndex < orderedGraphemes.length - 1) {
        setCurrentPuzzleIndex(prev => prev + 1);
      } else {
        // Module complete - play celebration
        soundManager.playFanfare();
        setShowModuleComplete(true);
        setTimeout(() => {
          window.location.href = createPageUrl('Home');
        }, 3000);
      }
    }, 500);
  };

  const generateOptions = () => {
    if (!currentGrapheme || orderedGraphemes.length < 4) return [];
    
    const options = [currentGrapheme];
    
    // Filter to same module and similar difficulty only
    const otherGraphemes = orderedGraphemes.filter(g => 
      g.id !== currentGrapheme.id && 
      g.module === currentGrapheme.module
    );
    
    // Prioritize similar difficulty
    const similarDifficulty = otherGraphemes.filter(g => 
      Math.abs(g.difficulty - currentGrapheme.difficulty) <= 1
    );
    
    const pool = similarDifficulty.length >= 3 ? similarDifficulty : otherGraphemes;
    
    while (options.length < 4 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      options.push(pool[randomIndex]);
      pool.splice(randomIndex, 1);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const generateTransliterationOptions = () => {
    if (!currentGrapheme) return [];
    
    const correct = currentGrapheme.transliteration;
    const options = [correct];
    
    // Filter to same module
    const otherGraphemes = orderedGraphemes.filter(g => 
      g.id !== currentGrapheme.id && 
      g.module === currentGrapheme.module
    );
    
    while (options.length < 4 && otherGraphemes.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherGraphemes.length);
      const transliteration = otherGraphemes[randomIndex].transliteration;
      if (!options.includes(transliteration)) {
        options.push(transliteration);
      }
      otherGraphemes.splice(randomIndex, 1);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  if (isLoading || orderedGraphemes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentGrapheme) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">No graphemes available for this module</p>
          <Link to={createPageUrl('Home')}>
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background transition-colors duration-300 overflow-y-auto">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="font-bold text-lg text-foreground">{stars}</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {currentPuzzleIndex + 1} / {orderedGraphemes.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-1.5">
            <motion.div 
              className="bg-primary h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentPuzzleIndex + 1) / orderedGraphemes.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Puzzle Area */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* <AnimatePresence mode="wait"> */}
          <motion.div
            key={`${currentGrapheme.id}-${puzzleType}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            {puzzleType === 'grapheme_match' && (
              <GraphemeMatch
                targetGrapheme={currentGrapheme}
                options={generateOptions()}
                onAnswer={handleAnswer}
                onTimeRecorded={setResponseTime}
              />
            )}
            
            {puzzleType === 'decompose_rebuild' && (
              <DecomposeRebuild
                targetGrapheme={currentGrapheme}
                onAnswer={handleAnswer}
                onTimeRecorded={setResponseTime}
              />
            )}
            
            {puzzleType === 'transliteration' && (
              <TransliterationChallenge
                targetGrapheme={currentGrapheme}
                options={generateTransliterationOptions()}
                onAnswer={handleAnswer}
                onTimeRecorded={setResponseTime}
              />
            )}
          </motion.div>
        {/* </AnimatePresence> */}
      </div>

      {/* Module Complete Celebration */}
      <AnimatePresence>
        {showModuleComplete && (
          <>
            <Celebration show={true} type="epic" />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center p-8 bg-card rounded-3xl shadow-2xl border border-border max-w-sm mx-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Module Complete!
                </h2>
                <div className="flex items-center justify-center gap-2 text-2xl text-primary mb-4">
                  <Star className="w-8 h-8 fill-primary" />
                  <span className="font-bold">{stars}</span>
                  <span className="text-muted-foreground text-lg">stars earned!</span>
                </div>
                <p className="text-muted-foreground">
                  Great job! Keep practicing to master more letters!
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}