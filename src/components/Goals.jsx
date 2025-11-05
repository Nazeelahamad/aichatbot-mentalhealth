// src/components/Goals.jsx
import React, { useState } from 'react';
import { Target, Plus, CheckCircle, Clock } from 'lucide-react';

export default function Goals({ goals = [], onAddGoal, onToggleGoal }) {
  const [newGoal, setNewGoal] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      onAddGoal({
        id: Date.now(),
        text: newGoal.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        category: 'wellness'
      });
      setNewGoal('');
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-500" />
            Wellness Goals
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your wellness goal..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleAddGoal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Goal
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {goals.map(goal => (
            <div key={goal.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => onToggleGoal(goal.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  goal.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {goal.completed && <CheckCircle className="w-4 h-4" />}
              </button>
              <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                {goal.text}
              </span>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          ))}
          
          {goals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No goals set yet. Add your first wellness goal!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
