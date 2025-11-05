import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MessageCircle, Activity, Heart, Users, Sun, Moon, Menu, X, Send, Mic, Calendar, TrendingUp, Clock, Sparkles, LogOut } from 'lucide-react';

// Import your existing components
import Login from './Login';
import Chat from './Chat';
import Exercises from './Exercises';
import Counselor from './Counselor';
import GuidedBreathing from './GuidedBreathing';
import JournalingModal from './JournalingModal';

// Enhanced Color System
const theme = {
  light: {
    bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    card: 'bg-white/80 backdrop-blur-sm',
    text: 'text-gray-900',
    muted: 'text-gray-600',
    border: 'border-gray-200',
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600',
    primaryHover: 'hover:from-purple-700 hover:to-pink-700',
    accent: 'bg-blue-500',
    shadow: 'shadow-lg shadow-purple-100/50'
  },
  dark: {
    bg: 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20',
    card: 'bg-gray-800/80 backdrop-blur-sm',
    text: 'text-white',
    muted: 'text-gray-400',
    border: 'border-gray-700',
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    primaryHover: 'hover:from-purple-600 hover:to-pink-600',
    accent: 'bg-blue-400',
    shadow: 'shadow-lg shadow-purple-900/30'
  }
};

// Helper functions from your original App.jsx
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');

const getMoodScore = (mood) => {
  switch (mood) {
    case 'happy': return 10;
    case 'calm': return 7;
    case 'stressed': return 4;
    case 'anxious': return 3;
    case 'sad': return 2;
    case 'angry': return 1;
    default: return 5;
  }
};

export default function EnhancedMentalHealthUI() {
  // Authentication State (from your original app)
  const [authToken, setAuthTokenState] = useState(getAuthToken());
  const [isLogged, setIsLogged] = useState(!!getAuthToken());
  const [userName, setUserName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  
  // App State
  const [dark, setDark] = useState(false);
  const [view, setView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState(0);
  const [currentMood, setCurrentMood] = useState('Not tracked');
  const [moodHistory, setMoodHistory] = useState([]);
  const [isJournaling, setIsJournaling] = useState(false);
  
  const t = dark ? theme.dark : theme.light;

  // Predefined moods
  const moods = [
    { key: 'happy', icon: '😄', color: 'from-yellow-400 to-orange-400', label: 'Happy' },
    { key: 'calm', icon: '😌', color: 'from-blue-400 to-cyan-400', label: 'Calm' },
    { key: 'stressed', icon: '😟', color: 'from-orange-400 to-red-400', label: 'Stressed' },
    { key: 'anxious', icon: '😥', color: 'from-purple-400 to-pink-400', label: 'Anxious' },
    { key: 'sad', icon: '😢', color: 'from-blue-500 to-indigo-500', label: 'Sad' },
    { key: 'angry', icon: '😠', color: 'from-red-500 to-pink-500', label: 'Angry' },
  ];

  const exercises = [
    { 
      id: 'breathing', 
      title: 'Deep Breathing', 
      desc: 'Guided 4-7-8 breathing technique',
      icon: '🫁',
      color: 'from-cyan-500 to-blue-500',
      duration: '5 min'
    },
    { 
      id: 'music', 
      title: 'Calming Music', 
      desc: 'Curated relaxation playlists',
      icon: '🎵',
      color: 'from-purple-500 to-pink-500',
      duration: '∞'
    },
    { 
      id: 'journal', 
      title: 'Journaling', 
      desc: 'Reflect on your thoughts',
      icon: '📝',
      color: 'from-orange-500 to-red-500',
      duration: '10 min'
    }
  ];

  // Save progress function (from your original app)
  const saveProgress = useCallback(async (dataToSave) => {
    const token = getAuthToken();
    if (!token) return;

    try {
        await fetch('/api/data/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dataToSave),
        });
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
  }, []);

  // Effect to save progress
  useEffect(() => {
    if (isLogged) {
        saveProgress({ messages, activities, currentMood, moodHistory });
    }
  }, [messages, activities, currentMood, moodHistory, isLogged, saveProgress]);

  // Helper for adding messages
  const appendMessage = (m) => setMessages(prev => [...prev, m]);

  // AUTHENTICATION HANDLER (from your original app)
  const handleAuth = async (authName, password, action) => {
    if (action === 'logout') {
        removeAuthToken();
        setAuthTokenState(null)
        setIsLogged(false);
        setUserName('');
        setMessages([]);
        setActivities(0);
        setCurrentMood('Not tracked');
        setMoodHistory([]);
        return;
    }
    
    setIsConnecting(true); 

    const endpoint = `/api/auth/${action}`;
    
    if (action === 'continue') {
        alert("Session continued. This relies on the browser having the valid token.");
        setIsLogged(true);
        setUserName(authName);
        setIsConnecting(false);
        return;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: authName, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setAuthTokenState(data.token);
            setAuthToken(data.token); 
            setUserName(data.userName);
            setActivities(data.activities);
            setMessages(data.messages);
            setCurrentMood(data.currentMood);
            setMoodHistory(data.moodHistory || []);
            setIsLogged(true);
            
            if (data.messages.length === 0 && action !== 'continue') {
              appendMessage({ sender: 'bot', text: `Welcome, ${data.userName}! I'm here to support you. How are you feeling today?`, timestamp: Date.now() });
            }
        } else {
            alert(data.message || 'Authentication failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Authentication Error:', error);
        alert('Network error: Could not connect to server.');
    } finally {
        setIsConnecting(false); 
    }
  };

  // MOOD HANDLER (from your original app)
  const handleSetMood = (mood) => {
    const today = new Date();
    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const moodScore = getMoodScore(mood);

    const newEntry = {
        date: dayName,
        mood: mood,
        score: moodScore
    };
    
    setMoodHistory(prevHistory => {
        const filteredHistory = prevHistory.filter(entry => entry.date !== dayName);
        const updatedHistory = [...filteredHistory, newEntry].slice(-7);
        return updatedHistory;
    });

    setCurrentMood(mood);
    appendMessage({ sender: 'bot', text: `Thanks for the check-in! You reported feeling: ${mood}. How can I support you today?`, timestamp: Date.now() });
    setView('chat'); 
  };

  // EXERCISE HANDLERS (from your original app)
  const completeBreathingExercise = () => {
    appendMessage({ sender: 'bot', text: "Fantastic! You completed the breathing exercise. How are you feeling now?", timestamp: Date.now(), isExercise: true });
    
    setActivities(a => {
        const newActivitiesCount = a + 1;
        saveProgress({ messages, activities: newActivitiesCount, currentMood, moodHistory });
        return newActivitiesCount;
    });
    setView('chat');
  };
  
  const startExercise = (type) => {
    if (type === 'breathing') {
        setView('guided_breathing');
    } else if (type === 'journal') { 
        setIsJournaling(true);
    } else if (type === 'music') { 
        const spotifyLink = 'https://open.spotify.com/album/4cMjrlhfv3MJ9ZtdmV4Oun?si=bN0wJ7RyT5uhbtF5hkI3mg'; 
        const messageText = `Music suggestion sent! Please click the button below to open your Calming Spotify Playlist.`;
        
        appendMessage({ sender: 'bot', text: messageText, timestamp: Date.now(), isExercise: true });
        setActivities(a => {
            const newActivitiesCount = a + 1;
            saveProgress({ messages, activities: newActivitiesCount, currentMood, moodHistory });
            return newActivitiesCount;
        });
        
        window.open(spotifyLink, '_blank');
    }
  };

  // JOURNAL HANDLER (from your original app)
  const logJournalEntry = (entryText) => {
    const entry = { text: `[Journal Entry] ${entryText}`, sender: 'user', timestamp: Date.now(), isJournalEntry: true };
    appendMessage(entry);
    
    appendMessage({ sender: 'bot', text: "Your thoughts have been logged securely. Remember to keep journaling!", timestamp: Date.now() });
    
    setActivities(a => {
        const newActivitiesCount = a + 1;
        saveProgress({ messages, activities: newActivitiesCount, currentMood, moodHistory });
        return newActivitiesCount;
    });

    setIsJournaling(false);
    setView('chat'); 
  };

  // Show login if not authenticated
  if (!isLogged) {
    return (
      <div className={`min-h-screen ${t.bg} ${t.text}`}>
        <Login 
          userName={userName} 
          setUserName={setUserName} 
          onAuth={handleAuth} 
          currentSessionUser={authToken ? "Active User" : null}
          isConnecting={isConnecting}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-all duration-300`}>
      {/* Enhanced Header */}
      <header className={`${t.card} ${t.shadow} border-b ${t.border} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${t.primary} rounded-xl flex items-center justify-center shadow-lg`}>
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">MindCare</h1>
                <p className={`text-xs ${t.muted}`}>Hello, {userName}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: 'dashboard', icon: Activity, label: 'Dashboard' },
                { id: 'chat', icon: MessageCircle, label: 'Chat' },
                { id: 'exercises', icon: Sparkles, label: 'Exercises' },
                { id: 'counselor', icon: Users, label: 'Connect' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    view === item.id 
                      ? `${t.primary} text-white shadow-md` 
                      : `${t.muted} hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setDark(!dark)}
                className={`p-2 rounded-lg ${t.card} border ${t.border} hover:scale-105 transition-transform`}
              >
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => handleAuth('', '', 'logout')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:shadow-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 px-4 space-y-2">
            {[
              { id: 'dashboard', icon: Activity, label: 'Dashboard' },
              { id: 'chat', icon: MessageCircle, label: 'Chat' },
              { id: 'exercises', icon: Sparkles, label: 'Exercises' },
              { id: 'counselor', icon: Users, label: 'Connect' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  view === item.id ? `${t.primary} text-white` : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Mood Tracker Card */}
            <div className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-pink-500" />
                How are you feeling?
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {moods.map(m => (
                  <button
                    key={m.key}
                    onClick={() => handleSetMood(m.key)}
                    className={`relative group flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-105 ${
                      currentMood === m.key 
                        ? `bg-gradient-to-br ${m.color} text-white shadow-xl` 
                        : `${t.card} border ${t.border} hover:shadow-lg`
                    }`}
                  >
                    <span className="text-3xl mb-2">{m.icon}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-3xl font-bold mb-1`}>{currentMood}</h3>
                <p className={`text-sm ${t.muted}`}>Current Mood</p>
              </div>

              <div className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-3xl font-bold mb-1`}>{activities}</h3>
                <p className={`text-sm ${t.muted}`}>Activities Completed</p>
              </div>

              <div className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-3xl font-bold mb-1`}>7 days</h3>
                <p className={`text-sm ${t.muted}`}>Daily Check-in</p>
              </div>
            </div>

            {/* Mood Chart */}
            <div className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Weekly Mood Trends
                </h3>
              </div>
              <div className="flex items-end justify-between h-48 space-x-4">
                {moodHistory.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center space-y-2">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:scale-105 cursor-pointer"
                      style={{ height: `${d.score * 10}%` }}
                    />
                    <span className={`text-xs font-medium ${t.muted}`}>{d.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat View - Use your existing Chat component */}
        {view === 'chat' && <Chat messages={messages} onAppendMessage={appendMessage} />}

        {/* Exercises View with enhanced design */}
        {view === 'exercises' && (
          <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
            {exercises.map(ex => (
              <div key={ex.id} className={`${t.card} ${t.shadow} rounded-2xl p-6 border ${t.border} hover:scale-105 transition-all cursor-pointer group`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${ex.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {ex.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{ex.title}</h3>
                <p className={`text-sm ${t.muted} mb-4`}>{ex.desc}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${t.muted} flex items-center`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {ex.duration}
                  </span>
                  <button 
                    onClick={() => startExercise(ex.id)}
                    className={`px-4 py-2 bg-gradient-to-r ${ex.color} text-white rounded-lg font-medium hover:shadow-lg transition-all`}
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Counselor View - Use your existing Counselor component */}
        {view === 'counselor' && <Counselor />}
        
        {/* Guided Breathing View - Use your existing component */}
        {view === 'guided_breathing' && <GuidedBreathing onComplete={completeBreathingExercise} />}
      </main>

      {/* Journaling Modal - Use your existing modal */}
      {isJournaling && <JournalingModal onSave={logJournalEntry} onClose={() => setIsJournaling(false)} />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
