// src/components/Insights.jsx
import React from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

export default function Insights({ moodHistory, activities, streakDays }) {
  const averageMood = moodHistory.length 
    ? (moodHistory.reduce((sum, m) => sum + m.score, 0) / moodHistory.length).toFixed(1)
    : 0;
  
  const moodTrend = moodHistory.length > 1 
    ? moodHistory[moodHistory.length - 1].score - moodHistory[0].score
    : 0;

  const achievements = [
    { id: 'first_chat', title: 'First Conversation', unlocked: activities > 0 },
    { id: 'week_streak', title: '7-Day Streak', unlocked: streakDays >= 7 },
    { id: 'mood_tracker', title: 'Mood Tracker', unlocked: moodHistory.length >= 5 },
    { id: 'wellness_warrior', title: 'Wellness Warrior', unlocked: activities >= 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Avg Mood</span>
          </div>
          <div className="text-2xl font-bold">{averageMood}/10</div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Streak</span>
          </div>
          <div className="text-2xl font-bold">{streakDays} days</div>
        </div>
        
        {/* Add more stat cards */}
      </div>

      {/* Achievements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2 text-yellow-500" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`p-4 rounded-lg border-2 ${
              achievement.unlocked 
                ? 'border-yellow-200 bg-yellow-50' 
                : 'border-gray-200 bg-gray-50 opacity-50'
            }`}>
              <div className="text-sm font-medium">{achievement.title}</div>
              <div className="text-xs text-gray-500">
                {achievement.unlocked ? '✅ Unlocked' : '🔒 Locked'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
