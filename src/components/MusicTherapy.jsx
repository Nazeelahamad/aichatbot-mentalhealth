// src/components/MusicTherapy.jsx
import React, { useState } from 'react';
import { Music, Play, Pause, SkipForward } from 'lucide-react';

const musicCategories = [
  { id: 'calm', name: 'Calming', color: 'from-blue-400 to-cyan-400' },
  { id: 'focus', name: 'Focus', color: 'from-purple-400 to-pink-400' },
  { id: 'energizing', name: 'Energizing', color: 'from-orange-400 to-yellow-400' },
  { id: 'sleep', name: 'Sleep', color: 'from-indigo-400 to-purple-400' },
];

export default function MusicTherapy({ onComplete }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-6">
      {/* Music Categories */}
      <div className="grid grid-cols-2 gap-4">
        {musicCategories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedCategory?.id === category.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Music className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <div className="font-medium">{category.name}</div>
          </button>
        ))}
      </div>

      {/* Music Player */}
      {selectedCategory && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${selectedCategory.color} rounded-xl flex items-center justify-center`}>
              <Music className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">{selectedCategory.name} Music</h4>
              <p className="text-sm text-gray-600">Therapeutic soundscape</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
