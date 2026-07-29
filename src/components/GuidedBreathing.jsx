import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';

// Define the breathing cycle steps and durations (in seconds)
const cycle = [
  { text: 'Inhale', duration: 4, label: 'Breathe In', color: 'from-blue-400 to-cyan-400' },
  { text: 'Hold', duration: 7, label: 'Hold', color: 'from-purple-400 to-blue-400' },
  { text: 'Exhale', duration: 8, label: 'Breathe Out', color: 'from-green-400 to-blue-400' }
];

export default function GuidedBreathing({ onComplete }) {
  const [cycleCount, setCycleCount] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(cycle[0].duration);
  const [isRunning, setIsRunning] = useState(true);
  const timerRef = useRef(null);
  
  const currentStep = cycle[stepIndex];
  const maxCycles = 3;

  useEffect(() => {
    if (cycleCount > maxCycles) {
      onComplete();
      return;
    }

    if (!isRunning) return;

    setTimeRemaining(currentStep.duration);

    timerRef.current = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          const nextIndex = (stepIndex + 1) % cycle.length;
          if (nextIndex === 0) {
            setCycleCount(c => c + 1);
          }
          setStepIndex(nextIndex);
          return currentStep.duration;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [stepIndex, cycleCount, onComplete, currentStep.duration, isRunning]);

  const togglePause = () => {
    setIsRunning(!isRunning);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Calculate total cycle duration for animation
  // Get animation scale based on current step
  const getAnimationScale = () => {
    switch (currentStep.text) {
      case 'Inhale': return 'scale-150';
      case 'Hold': return 'scale-150';
      case 'Exhale': return 'scale-100';
      default: return 'scale-100';
    }
  };

  if (cycleCount > maxCycles) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Well Done!</h3>
          <p className="text-gray-600 mb-6">
            You finished 3 cycles of 4-7-8 breathing. Great job taking time for yourself!
          </p>
          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onComplete}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h3 className="text-xl font-bold text-gray-900">4-7-8 Breathing</h3>
          <button
            onClick={togglePause}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isRunning ? <Pause className="w-6 h-6 text-gray-600" /> : <Play className="w-6 h-6 text-gray-600" />}
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Cycle {cycleCount} of {maxCycles}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((cycleCount - 1) / maxCycles) * 100 + ((3 - stepIndex) / 3) * (100 / maxCycles)}%` }}
            />
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Main breathing circle with animation */}
            <div 
              className={`
                w-48 h-48 rounded-full flex items-center justify-center text-white font-bold text-xl
                bg-gradient-to-br ${currentStep.color} shadow-2xl
                transform transition-all duration-1000 ease-in-out
                ${isRunning ? getAnimationScale() : 'scale-125'}
                ${isRunning ? 'animate-pulse' : ''}
              `}
              style={{
                transitionDuration: `${currentStep.duration}s`,
              }}
            >
              {/* Inner circle */}
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{timeRemaining}</div>
                  <div className="text-sm opacity-90">seconds</div>
                </div>
              </div>
            </div>

            {/* Breathing rings */}
            <div className={`
              absolute inset-0 w-48 h-48 rounded-full border-4 border-white/30
              transform transition-all duration-1000 ease-in-out
              ${isRunning && currentStep.text === 'Inhale' ? 'scale-150 opacity-20' : 'scale-100 opacity-30'}
            `} />
            <div className={`
              absolute inset-0 w-48 h-48 rounded-full border-2 border-white/20
              transform transition-all duration-1000 ease-in-out delay-200
              ${isRunning && currentStep.text === 'Inhale' ? 'scale-175 opacity-10' : 'scale-110 opacity-20'}
            `} />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center">
          <h4 className="text-3xl font-bold text-gray-900 mb-2">{currentStep.label}</h4>
          <p className="text-gray-600 mb-4">
            {currentStep.text === 'Inhale' && 'Breathe in slowly through your nose'}
            {currentStep.text === 'Hold' && 'Hold your breath gently'}
            {currentStep.text === 'Exhale' && 'Breathe out slowly through your mouth'}
          </p>
          
          {/* Step indicators */}
          <div className="flex justify-center space-x-2">
            {cycle.map((step, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === stepIndex 
                    ? 'bg-blue-500 scale-125' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-700">
            <strong>💡 Tips:</strong> Find a comfortable position and focus on the circle. 
            Let the animation guide your breathing rhythm.
          </div>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style>{`
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
