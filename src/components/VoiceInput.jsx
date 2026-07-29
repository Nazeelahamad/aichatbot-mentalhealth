import { useState } from "react";

export default function VoiceInput() {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={startListening}
        className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-blue-700"
      >
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
      <p className="mt-4 text-lg font-medium">{text}</p>
    </div>
  );
}
