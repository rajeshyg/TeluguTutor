import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trophy, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConfidenceIndicator from '@/components/learning/ConfidenceIndicator';
import { useAuth } from '@/contexts/AuthContext';

export default function Progress() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  const { data: masteryData = [] } = useQuery({
    queryKey: ['allMastery', user?.email],
    queryFn: () => base44.entities.GraphemeMastery.filter({ user_email: user.email }),
    enabled: !!user
  });

  const { data: graphemes = [] } = useQuery({
    queryKey: ['allGraphemes'],
    queryFn: () => base44.entities.TeluguGrapheme.list()
  });

  const { data: recentSessions = [] } = useQuery({
    queryKey: ['recentSessions', user?.email],
    queryFn: () => base44.entities.PracticeSession.filter(
      { user_email: user.email },
      '-session_date',
      20
    ),
    enabled: !!user
  });

  const getGraphemeData = (graphemeId) => {
    return graphemes.find(g => g.id === graphemeId);
  };

  const getMasteryByLevel = (level) => {
    return masteryData.filter(m => m.mastery_level === level);
  };

  const getFilteredMastery = () => {
    if (activeTab === 'all') return masteryData;
    return getMasteryByLevel(activeTab);
  };

  const stats = {
    mastered: getMasteryByLevel('mastered').length,
    proficient: getMasteryByLevel('proficient').length,
    practicing: getMasteryByLevel('practicing').length,
    learning: getMasteryByLevel('learning').length,
    avgConfidence: masteryData.length > 0
      ? Math.round(masteryData.reduce((sum, m) => sum + m.confidence_score, 0) / masteryData.length)
      : 0,
    totalAttempts: masteryData.reduce((sum, m) => sum + m.total_attempts, 0),
    totalSuccessful: masteryData.reduce((sum, m) => sum + m.successful_attempts, 0)
  };

  const overallAccuracy = stats.totalAttempts > 0
    ? Math.round((stats.totalSuccessful / stats.totalAttempts) * 100)
    : 0;

  return (
    <div className="w-full h-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <h1 className="text-2xl font-bold text-foreground">Your Progress</h1>
            <div className="w-16" />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.mastered}</p>
                  <p className="text-xs text-muted-foreground">Mastered</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.avgConfidence}</p>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{overallAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 bg-secondary/50 border-border">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
                  <p className="text-xs text-muted-foreground">Total Practice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mastery Details */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4 bg-muted">
            <TabsTrigger value="all">All ({masteryData.length})</TabsTrigger>
            <TabsTrigger value="mastered">Mastered ({stats.mastered})</TabsTrigger>
            <TabsTrigger value="proficient">Proficient ({stats.proficient})</TabsTrigger>
            <TabsTrigger value="practicing">Practicing ({stats.practicing})</TabsTrigger>
            <TabsTrigger value="learning">Learning ({stats.learning})</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getFilteredMastery().map((mastery, index) => {
              const grapheme = getGraphemeData(mastery.grapheme_id);
              if (!grapheme) return null;
              
              return (
                <motion.div
                  key={mastery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ConfidenceIndicator
                    confidenceScore={mastery.confidence_score}
                    masteryLevel={mastery.mastery_level}
                    grapheme={grapheme.glyph}
                  />
                  
                  <div className="mt-2 px-4 py-2 bg-muted rounded-lg text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Attempts: {mastery.total_attempts}</span>
                      <span>Success: {mastery.successful_attempts}</span>
                      <span>Streak: {mastery.consecutive_successes}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {getFilteredMastery().length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No graphemes in this category yet</p>
              <Link to={createPageUrl('Home')}>
                <Button className="mt-3">Start Learning</Button>
              </Link>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}