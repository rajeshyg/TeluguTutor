import React, { useState, useEffect } from 'react';
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

export default function Progress() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900">Your Progress</h1>
            <div className="w-20" />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-3xl font-bold text-green-900">{stats.mastered}</p>
                  <p className="text-sm text-green-700">Mastered</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-3xl font-bold text-blue-900">{stats.avgConfidence}</p>
                  <p className="text-sm text-blue-700">Avg Confidence</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-3xl font-bold text-purple-900">{overallAccuracy}%</p>
                  <p className="text-sm text-purple-700">Accuracy</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-3xl font-bold text-orange-900">{stats.totalAttempts}</p>
                  <p className="text-sm text-orange-700">Total Practice</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mastery Details */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({masteryData.length})</TabsTrigger>
            <TabsTrigger value="mastered">Mastered ({stats.mastered})</TabsTrigger>
            <TabsTrigger value="proficient">Proficient ({stats.proficient})</TabsTrigger>
            <TabsTrigger value="practicing">Practicing ({stats.practicing})</TabsTrigger>
            <TabsTrigger value="learning">Learning ({stats.learning})</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="mt-2 px-4 py-2 bg-gray-50 rounded-lg text-xs text-gray-600">
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
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No graphemes in this category yet</p>
              <Link to={createPageUrl('Home')}>
                <Button className="mt-4">Start Learning</Button>
              </Link>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}