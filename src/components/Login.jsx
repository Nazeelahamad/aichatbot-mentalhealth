import { useState } from 'react';
import { User, Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function Login({ userName, setUserName, onAuth, currentSessionUser, isConnecting }) {
  const [password, setPassword] = useState('');

  const handleAction = (action) => {
    if (isConnecting || !userName.trim() || !password.trim()) {
      return;
    }
    onAuth(userName, password, action);
  };

  const handleContinue = () => {
    if(currentSessionUser && !isConnecting) {
      onAuth(currentSessionUser, '', 'continue');
    }
  };

  if (currentSessionUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            {isConnecting ? (
              <div className="animate-pulse">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting to Server...</h2>
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, **Active User**!</h2>
                <p className="text-gray-600">🔒 Data stored in your browser's Local Storage.</p>
              </>
            )}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Continue Session</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">MindCare</h1>
          <p className="text-gray-600">Your safe space for emotional support</p>
        </div>

        {isConnecting ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Connecting to Server...</p>
          </div>
        ) : (
          <p className="text-gray-600 text-center mb-6">Enter your credentials to login or register.</p>
        )}

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              disabled={isConnecting}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAction('login')}
              placeholder="Enter your password"
              disabled={isConnecting}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAction('login')}
              disabled={isConnecting || !userName.trim() || !password.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>

            <button
              onClick={() => handleAction('register')}
              disabled={isConnecting || !userName.trim() || !password.trim()}
              className="bg-white text-purple-600 border border-purple-600 py-3 px-4 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            🔒 This prototype simulates a database using Local Storage.
          </p>
        </div>
      </div>
    </div>
  );
}
