const moods = [
  { key: 'happy', icon: '😄' },
  { key: 'calm', icon: '😌' },
  { key: 'stressed', icon: '😟' },
  { key: 'anxious', icon: '😥' },
  { key: 'sad', icon: '😢' },
  { key: 'angry', icon: '😠' },
];

export default function MoodTracker({ onSetMood }) {
  return (
    <div className="card">
      <h3>How are you feeling right now?</h3>
      <div className="row" style={{ gap: '15px', justifyContent: 'center' }}>
        {moods.map((m) => (
          <button 
            key={m.key}
            className="btn ghost"
            onClick={() => onSetMood(m.key)} // Calls function in App.jsx
            style={{ padding: '10px 14px', fontSize: '20px' }}
            title={m.key} 
          >
            {m.icon}
          </button>
        ))}
      </div>
    </div>
  );
}