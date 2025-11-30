import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  BookOpen, Trophy, Target, Sparkles, Lock, 
  TrendingUp, Percent, Award 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AdaptivePracticeAlert from '@/components/learning/AdaptivePracticeAlert';
import { TELUGU_GRAPHEMES } from '@/data/teluguGraphemes';
import { useAuth } from '@/contexts/AuthContext';

const MODULES = [
  { 
    id: 'achchulu', 
    name: 'Achchulu', 
    description: 'Vowels',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-500',
    difficulty: 1
  },
  { 
    id: 'hallulu', 
    name: 'Hallulu', 
    description: 'Consonants',
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-500',
    difficulty: 1
  },
  { 
    id: 'gunintalu', 
    name: 'Gunintalu', 
    description: 'Vowel signs & diacritics',
    icon: Sparkles,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 2
  },
  { 
    id: 'hachchulu', 
    name: 'Hachchulu', 
    description: 'Consonant + vowel forms',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    difficulty: 3
  },
  { 
    id: 'vattulu', 
    name: 'Vattulu', 
    description: 'Consonant conjuncts',
    icon: TrendingUp,
    color: 'from-orange-500 to-red-500',
    difficulty: 4
  },
  { 
    id: 'words', 
    name: 'Words', 
    description: 'Complete word puzzles',
    icon: Award,
    color: 'from-yellow-500 to-orange-500',
    difficulty: 5
    // requiresUnlock removed to make it available
  }
];

export default function Home() {
  const { user } = useAuth();
  const [showAdaptivePractice, setShowAdaptivePractice] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ user_id: user.id });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  const { data: masteryData = [] } = useQuery({
    queryKey: ['allMastery', user?.id],
    queryFn: () => base44.entities.GraphemeMastery.filter({ user_id: user.id }),
    enabled: !!user
  });

  const { data: strugglingGraphemes = [] } = useQuery({
    queryKey: ['strugglingGraphemes', user?.id],
    queryFn: async () => {
      const struggling = await base44.entities.GraphemeMastery.filter({ 
        user_id: user.id,
        needs_adaptive_practice: true
      });
      
      const graphemeIds = struggling.map(m => m.grapheme_id);
      if (graphemeIds.length === 0) return [];
      
      const graphemes = await base44.entities.TeluguGrapheme.list();
      return graphemes.filter(g => graphemeIds.includes(g.id));
    },
    enabled: !!user
  });

  useEffect(() => {
    if (strugglingGraphemes.length >= 3) {
      setShowAdaptivePractice(true);
    }
  }, [strugglingGraphemes]);

  // Create a map of grapheme_id to module for efficient lookup
  const graphemeModuleMap = useMemo(() => {
    const map = new Map();
    TELUGU_GRAPHEMES.forEach(g => map.set(g.id, g.module));
    return map;
  }, []);

  // Get total graphemes per module
  const moduleGraphemeCounts = useMemo(() => {
    const counts = {};
    TELUGU_GRAPHEMES.forEach(g => {
      counts[g.module] = (counts[g.module] || 0) + 1;
    });
    return counts;
  }, []);

  const getModuleProgress = (moduleId) => {
    // Filter mastery data to only include graphemes from this specific module
    const moduleMastery = masteryData.filter(m => {
      const graphemeModule = graphemeModuleMap.get(m.grapheme_id);
      return graphemeModule === moduleId;
    });
    
    const totalInModule = moduleGraphemeCounts[moduleId] || 10;
    
    // Count graphemes that have been practiced (any attempts)
    const practiced = moduleMastery.filter(m => m.total_attempts > 0).length;
    
    // Calculate average confidence of practiced items
    const avgConfidence = practiced > 0 
      ? moduleMastery.reduce((sum, m) => sum + (m.confidence_score || 0), 0) / practiced 
      : 0;
    
    // Progress percentage based on practiced items
    const progressPercent = Math.round((practiced / totalInModule) * 100);
    
    return {
      completed: moduleMastery.filter(m => m.confidence_score >= 80).length,
      practiced,
      total: totalInModule,
      avgConfidence,
      progressPercent
    };
  };

  const isModuleUnlocked = (module) => {
    if (!module.requiresUnlock) return true;
    return profile?.unlocked_word_puzzles || false;
  };

  // Calculate stats inline with Progress page
  const stats = useMemo(() => {
    const totalAttempts = masteryData.reduce((sum, m) => sum + (m.total_attempts || 0), 0);
    const totalSuccessful = masteryData.reduce((sum, m) => sum + (m.successful_attempts || 0), 0);
    const accuracy = totalAttempts > 0 ? Math.round((totalSuccessful / totalAttempts) * 100) : 0;
    const mastered = masteryData.filter(m => m.mastery_level === 'mastered').length;
    
    return {
      accuracy,
      totalAttempts,
      mastered
    };
  }, [masteryData]);

  return (
    <div className="w-full h-full bg-background transition-colors duration-300 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Welcome back, {profile?.display_name || 'Learner'}
              </p>
            </div>
            {/* Progress button removed */}
          </div>

          {/* Compact Stats Bar - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 w-max sm:w-full">
              {/* Make each stats card a link to /progress */}
              <Link to={createPageUrl('Progress')} className="flex-shrink-0 sm:flex-1 min-w-max sm:min-w-0">
                <div className="bg-secondary/30 border border-border rounded-lg p-2 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Trophy className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-lg font-bold text-foreground leading-none">{profile?.total_stars || 0}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Stars</span>
                </div>
              </Link>
              <Link to={createPageUrl('Progress')} className="flex-shrink-0 sm:flex-1 min-w-max sm:min-w-0">
                <div className="bg-secondary/30 border border-border rounded-lg p-2 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Target className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-lg font-bold text-foreground leading-none">
                      {stats.mastered}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Mastered</span>
                </div>
              </Link>
              <Link to={createPageUrl('Progress')} className="flex-shrink-0 sm:flex-1 min-w-max sm:min-w-0">
                <div className="bg-secondary/30 border border-border rounded-lg p-2 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-lg font-bold text-foreground leading-none">
                      {stats.accuracy}%
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Accuracy</span>
                </div>
              </Link>
              <Link to={createPageUrl('Progress')} className="flex-shrink-0 sm:flex-1 min-w-max sm:min-w-0">
                <div className="bg-secondary/30 border border-border rounded-lg p-2 flex flex-col items-center justify-center text-center hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-lg font-bold text-foreground leading-none">
                      {masteryData.length > 0 
                        ? Math.round(masteryData.reduce((sum, m) => sum + (m.confidence_score || 0), 0) / masteryData.length) 
                        : 0}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Confidence</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-5xl mx-auto px-4 py-4 pb-20">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Learning Modules</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MODULES.map((module, index) => {
            const Icon = module.icon;
            const progress = getModuleProgress(module.id);
            const unlocked = isModuleUnlocked(module);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={unlocked ? createPageUrl('Learn', `?module=${module.id}`) : '#'}
                  className={!unlocked ? 'pointer-events-none' : ''}
                >
                  <Card className={`
                    h-full transition-all duration-200 
                    bg-card border-border hover:border-primary/50
                    ${unlocked 
                      ? 'hover:shadow-md cursor-pointer' 
                      : 'opacity-70 grayscale-[0.5]'
                    }
                  `}>
                    <div className="p-3 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`
                          p-2 rounded-lg bg-gradient-to-br ${module.color} 
                          shadow-sm text-white
                        `}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {unlocked && (
                          <div className="text-[10px] font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">
                            {progress.progressPercent}%
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-card-foreground truncate">
                          {module.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {module.description}
                        </p>
                      </div>

                      <div className="mt-3">
                        {unlocked ? (
                          <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${module.color}`} 
                              style={{ width: `${progress.progressPercent}%` }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Adaptive Practice Alert */}
      {showAdaptivePractice && (
        <AdaptivePracticeAlert
          strugglingGraphemes={strugglingGraphemes}
          onStartPractice={() => {
            window.location.href = createPageUrl('MicroPractice');
          }}
          onDismiss={() => setShowAdaptivePractice(false)}
        />
      )}
    </div>
  );
}