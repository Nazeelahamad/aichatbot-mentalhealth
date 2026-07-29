import { useRef, useEffect, useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { getApiUrl } from '../utils/api';

export default function Chat({ messages, onAppendMessage }) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input.trim(), sender: 'user', timestamp: Date.now() };
    onAppendMessage(userMsg);
    setInput('');
    setIsLoading(true);

    const history = messages.slice(-5);
    const userToken = localStorage.getItem('authToken');

    try {
      const response = await fetch(getApiUrl('/api/chat/ai_response'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          message: userMsg.text,
          history: history.map(m => ({ sender: m.sender, text: m.text }))
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMsg = {
          text: data.response,
          sender: 'bot',
          timestamp: Date.now(),
          emotion: data.emotion,
          suggestion: data.response.split('.').pop().trim()
        };
        onAppendMessage(botMsg);
      } else {
        onAppendMessage({
          text: data.response || "Sorry, I couldn't connect to my AI brain. Check your backend logs.",
          sender: 'bot',
          timestamp: Date.now(),
          emotion: 'error'
        });
      }
    } catch (error) {
      console.error('Frontend Fetch Error:', error);
      onAppendMessage({
        text: 'Network issue. Check your backend server is running and accessible.',
        sender: 'bot',
        timestamp: Date.now(),
        emotion: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
      setListening(true);
    } catch (error) {
      console.error("Speech Recognition error:", error);
      setListening(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Companion</h3>
              <p className="text-sm text-purple-100">Always here to listen</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              } rounded-2xl p-4 shadow-md`}>
                <p className="text-sm">{msg.text}</p>
                <span className={`text-xs ${msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'} mt-2 block`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
                {msg.emotion && (
                  <div className="mt-2 px-2 py-1 bg-black/10 rounded-full text-xs inline-block">
                    Mood: {msg.emotion}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl p-4 max-w-[70%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={startListening}
              disabled={listening}
              className={`p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors ${
                listening ? 'bg-red-100 border-red-300' : 'bg-white'
              }`}
            >
              {listening ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5 text-gray-600" />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
