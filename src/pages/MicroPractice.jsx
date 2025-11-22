import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GraphemeMatch from '@/components/puzzles/GraphemeMatch';
import DecomposeRebuild from '@/components/puzzles/DecomposeRebuild';

export default function MicroPractice() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [puzzleType, setPuzzleType] = useState('grapheme_match');
  const [responseTime, setResponseTime] = useState(0);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: strugglingGraphemes = [] } = useQuery({
    queryKey: ['strugglingForPractice', user?.email],
    queryFn: async () => {
      const struggling = await base44.entities.GraphemeMastery.filter({
        user_email: user.email,
        needs_adaptive_practice: true
      });
      
      const graphemeIds = struggling.map(m => m.grapheme_id);
      if (graphemeIds.length === 0) return [];
      
      const allGraphemes = await base44.entities.TeluguGrapheme.list();
      return allGraphemes.filter(g => graphemeIds.includes(g.id));
    },
    enabled: !!user
  });

  const { data: allGraphemes = [] } = useQuery({
    queryKey: ['allGraphemesForOptions'],
    queryFn: () => base44.entities.TeluguGrapheme.list()
  });

  const updateMasteryMutation = useMutation({
    mutationFn: async ({ graphemeId, success }) => {
      const mastery = await base44.entities.GraphemeMastery.filter({
        user_email: user.email,
        grapheme_id: graphemeId
      });
      
      if (mastery[0]) {
        const current = mastery[0];
        const newStruggle = success ? Math.max(0, current.struggle_count - 1) : current.struggle_count;
        
        await base44.entities.GraphemeMastery.update(current.id, {
          struggle_count: newStruggle,
          needs_adaptive_practice: newStruggle >= 3,
          consecutive_successes: success ? current.consecutive_successes + 1 : 0,
          total_attempts: current.total_attempts + 1,
          successful_attempts: current.successful_attempts + (success ? 1 : 0)
        });
        
        await base44.entities.PracticeSession.create({
          user_email: user.email,
          grapheme_id: graphemeId,
          puzzle_type: puzzleType,
          was_successful: success,
          response_time: responseTime,
          attempts_taken: 1,
          is_adaptive_practice: true,
          session_date: new Date().toISOString()
        });
      }
      
      queryClient.invalidateQueries(['strugglingForPractice']);
      queryClient.invalidateQueries(['mastery']);
    }
  });

  const currentGrapheme = strugglingGraphemes[currentIndex];

  const handleAnswer = async (correct) => {
    if (!currentGrapheme || !user) return;
    
    await updateMasteryMutation.mutateAsync({
      graphemeId: currentGrapheme.id,
      success: correct
    });
    
    if (correct) {
      setCompletedCount(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentIndex < strugglingGraphemes.length - 1) {
        setCurrentIndex(prev => prev + 1);
        const nextGrapheme = strugglingGraphemes[currentIndex + 1];
        // Only use decompose_rebuild if grapheme has multiple components
        if (nextGrapheme && nextGrapheme.components && nextGrapheme.components.length > 1 && nextGrapheme.components.join('') !== nextGrapheme.glyph) {
          setPuzzleType(Math.random() > 0.5 ? 'grapheme_match' : 'decompose_rebuild');
        } else {
          setPuzzleType('grapheme_match');
        }
      } else {
        alert('Great work! You completed the adaptive practice! 🎉');
        window.location.href = createPageUrl('Home');
      }
    }, 1000);
  };

  const generateOptions = () => {
    if (!currentGrapheme || allGraphemes.length < 4) return [];
    
    const confusables = currentGrapheme.confusable_with || [];
    const options = [currentGrapheme];
    
    // Prioritize confusable graphemes
    confusables.forEach(confusableId => {
      const confusable = allGraphemes.find(g => g.id === confusableId);
      if (confusable && options.length < 4) {
        options.push(confusable);
      }
    });
    
    // Fill remaining with same module graphemes ONLY
    const remaining = allGraphemes.filter(g => 
      g.id !== currentGrapheme.id && 
      g.module === currentGrapheme.module &&
      !options.find(o => o.id === g.id)
    );
    
    while (options.length < 4 && remaining.length > 0) {
      const randomIndex = Math.floor(Math.random() * remaining.length);
      options.push(remaining[randomIndex]);
      remaining.splice(randomIndex, 1);
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  if (!user || strugglingGraphemes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h2>
          <p className="text-gray-600 mb-6">No letters need extra practice right now</p>
          <Link to={createPageUrl('Home')}>
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="text-white hover:bg-white/20 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Adaptive Practice</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span className="font-bold">{completedCount}/{strugglingGraphemes.length}</span>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div 
              className="bg-white h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / strugglingGraphemes.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Practice Area */}
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6 text-center">
          <div className="inline-block bg-white rounded-2xl px-6 py-3 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Focused Practice</p>
            <p className="text-lg font-bold text-orange-600">
              Letter {currentIndex + 1} of {strugglingGraphemes.length}
            </p>
          </div>
        </div>

        {currentGrapheme && (
          <motion.div
            key={currentGrapheme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {puzzleType === 'grapheme_match' ? (
              <GraphemeMatch
                targetGrapheme={currentGrapheme}
                options={generateOptions()}
                onAnswer={handleAnswer}
                onTimeRecorded={setResponseTime}
              />
            ) : (
              <DecomposeRebuild
                targetGrapheme={currentGrapheme}
                onAnswer={handleAnswer}
                onTimeRecorded={setResponseTime}
              />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}