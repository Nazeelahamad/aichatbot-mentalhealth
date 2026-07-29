export default function Exercises({ onStart }) {
  const items = [
    { id: 'breathing', title: 'Breathing', desc: 'Guided 4-7-8 breathing' },
    { id: 'music', title: 'Calming Music', desc: 'Play soothing playlists' },
    { id: 'journal', title: 'Journaling', desc: 'Prompts to reflect' }
  ];

  return (
    <div className="grid three">
      {items.map(it => (
        <div key={it.id} className="card">
          <h3>{it.title}</h3>
          <p className="muted">{it.desc}</p>
          <button className="btn" onClick={() => onStart(it.id)}>Start</button>
        </div>
      ))}
    </div>
  );
}