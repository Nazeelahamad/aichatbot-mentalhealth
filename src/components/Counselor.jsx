import { useState } from 'react';
import { Users, Phone, AlertTriangle } from 'lucide-react';

export default function Counselor() {
  const [counselors, setCounselors] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Clinical Psychologist',
      status: 'Available now',
      isConnecting: false,
      avatar: '👩‍⚕️'
    },
    {
      id: 2,
      name: 'Michael Patel',
      role: 'Student Counselor',
      status: 'Available in 30 mins',
      isConnecting: false,
      avatar: '👨‍⚕️'
    }
  ]);

  const handleConnect = (id) => {
    setCounselors(prev => prev.map(c => 
      c.id === id ? { ...c, isConnecting: true } : c
    ));

    setTimeout(() => {
      const counselor = counselors.find(c => c.id === id);
      alert(`Connection to ${counselor.name} is established! (Mock call)`);
      setCounselors(prev => prev.map(c => 
        c.id === id ? { ...c, isConnecting: false } : c
      ));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Connect with a Counselor</h2>
          <p className="text-gray-600">Demo directory — this screen does not place a real call or booking.</p>
          </div>
        </div>

        {/* Counselors List */}
        <div className="space-y-4">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                    {counselor.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{counselor.name}</h4>
                    <p className="text-sm text-gray-600">{counselor.role}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">{counselor.status}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleConnect(counselor.id)}
                  disabled={counselor.isConnecting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {counselor.isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Demo Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crisis Support Notice */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">
              <strong>India crisis support:</strong> If you or someone else is in immediate danger, call 112. For mental-health support, contact Tele-MANAS.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Emergency (India): 112</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Tele-MANAS: 14416</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Tele-MANAS: 1800-89-14416</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
