import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  BookOpen, Trophy, Target, Sparkles, Lock, 
  TrendingUp, Clock, Award 
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
    difficulty: 5,
    requiresUnlock: true
  }
];

export default function Home() {
  const { user } = useAuth();
  const [showAdaptivePractice, setShowAdaptivePractice] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user
  });

  const { data: masteryData = [] } = useQuery({
    queryKey: ['allMastery', user?.email],
    queryFn: () => base44.entities.GraphemeMastery.filter({ user_email: user.email }),
    enabled: !!user
  });

  const { data: strugglingGraphemes = [] } = useQuery({
    queryKey: ['strugglingGraphemes', user?.email],
    queryFn: async () => {
      const struggling = await base44.entities.GraphemeMastery.filter({ 
        user_email: user.email,
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
      return graphemeModule === moduleId && m.confidence_score > 0;
    });
    
    const totalInModule = moduleGraphemeCounts[moduleId] || 10;
    
    return {
      completed: moduleMastery.filter(m => m.confidence_score >= 80).length,
      total: totalInModule,
      avgConfidence: moduleMastery.length > 0 
        ? moduleMastery.reduce((sum, m) => sum + m.confidence_score, 0) / moduleMastery.length 
        : 0
    };
  };

  const isModuleUnlocked = (module) => {
    if (!module.requiresUnlock) return true;
    return profile?.unlocked_word_puzzles || false;
  };

  return (
    <div className="w-full h-full bg-background transition-colors duration-300 overflow-y-auto">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Telugu Learning
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Welcome back, {profile?.display_name || 'Learner'}!
              </p>
            </div>
            
            <Link to={createPageUrl('Progress')}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Trophy className="w-4 h-4" />
                View Progress
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Trophy className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{profile?.total_stars || 0}</p>
                  <p className="text-xs text-muted-foreground">Stars Earned</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <div className="bg-accent p-1.5 rounded-lg">
                  <Target className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {masteryData.filter(m => m.mastery_level === 'mastered').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Letters Mastered</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <div className="bg-muted p-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {profile?.total_practice_time || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Minutes Practiced</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Learning Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((module, index) => {
            const Icon = module.icon;
            const progress = getModuleProgress(module.id);
            const unlocked = isModuleUnlocked(module);
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={unlocked ? createPageUrl('Learn', `?module=${module.id}`) : '#'}
                  className={!unlocked ? 'pointer-events-none' : ''}
                >
                  <Card className={`
                    p-4 h-full transition-all duration-300 cursor-pointer bg-card border-border
                    ${unlocked 
                      ? 'hover:scale-[1.02] hover:shadow-lg' 
                      : 'opacity-60'
                    }
                  `}>
                    <div className={`
                      bg-gradient-to-br ${module.color} 
                      rounded-xl p-4 mb-3 relative overflow-hidden
                    `}>
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-lg font-bold text-card-foreground mb-1">
                      {module.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {module.description}
                    </p>

                    {unlocked ? (
                      <>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold text-foreground">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-1.5 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Master more letters to unlock
                        </p>
                      </div>
                    )}
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