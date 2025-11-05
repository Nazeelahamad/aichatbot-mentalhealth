// simple keyword-based emotion detector
export default function detectEmotion(text = '') {
  const lower = text.toLowerCase();
  const map = {
    anxious: ['anxious','worried','nervous','scared','afraid','panic','stress','stressed'],
    sad: ['sad','depressed','lonely','hurt','pain','cry','down','hopeless'],
    angry: ['angry','mad','furious','annoyed','irritated','frustrated'],
    happy: ['happy','great','good','amazing','joy','glad'],
    stressed: ['overwhelmed','pressure','exhausted','tired','burden']
  };

  for (const [emotion, keys] of Object.entries(map)) {
    if (keys.some(k => lower.includes(k))) return emotion;
  }
  return 'neutral';
}