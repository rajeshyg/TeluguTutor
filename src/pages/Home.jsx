import React, { useState, useEffect } from 'react';
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
  const [user, setUser] = useState(null);
  const [showAdaptivePractice, setShowAdaptivePractice] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

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

  const getModuleProgress = (moduleId) => {
    const moduleMastery = masteryData.filter(m => {
      // This would require joining with grapheme data - simplified for now
      return m.confidence_score > 0;
    });
    
    return {
      completed: moduleMastery.filter(m => m.confidence_score >= 80).length,
      total: Math.max(moduleMastery.length, 10),
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Telugu Learning
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {profile?.display_name || 'Learner'}!
              </p>
            </div>
            
            <Link to={createPageUrl('Progress')}>
              <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 gap-2 text-white">
                <Trophy className="w-4 h-4" />
                View Progress
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{profile?.total_stars || 0}</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Stars Earned</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {masteryData.filter(m => m.mastery_level === 'mastered').length}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Letters Mastered</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {profile?.total_practice_time || 0}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">Minutes Practiced</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Learning Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    p-6 h-full transition-all duration-300 cursor-pointer bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700
                    ${unlocked 
                      ? 'hover:scale-105 hover:shadow-xl dark:hover:shadow-slate-900/50' 
                      : 'opacity-60'
                    }
                  `}>
                    <div className={`
                      bg-gradient-to-br ${module.color} 
                      rounded-2xl p-6 mb-4 relative overflow-hidden
                    `}>
                      {!unlocked && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Lock className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {module.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {module.description}
                    </p>

                    {unlocked ? (
                      <>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
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