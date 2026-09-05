import React, { useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioButtonProps {
  textToSpeak?: string;
  label?: string;
  variant?: 'orange' | 'purple' | 'red' | 'green' | 'gray' | 'yellow';
}

export default function AudioButton({ textToSpeak, label = "Play Audio", variant = "orange" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!textToSpeak) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-GB'; // British English for London styling!
    
    // Select a premium British voice if available
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find(v => v.lang.startsWith('en-GB'));
    if (gbVoice) {
      utterance.voice = gbVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const getColors = () => {
    switch (variant) {
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 shadow-purple-200';
      case 'red':
        return 'bg-red-600 hover:bg-red-700 shadow-red-200';
      case 'green':
        return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200';
      case 'gray':
        return 'bg-slate-600 hover:bg-slate-700 shadow-slate-200';
      case 'yellow':
        return 'bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-amber-100';
      default:
        return 'bg-amber-600 hover:bg-amber-700 shadow-amber-200';
    }
  };

  return (
    <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-200 py-3 px-6 rounded-full shadow-sm">
      <button
        onClick={handlePlay}
        className={`flex items-center gap-2 text-white font-bold py-2 px-5 rounded-full transition-transform active:scale-95 cursor-pointer shadow-md ${getColors()}`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        <span>{isPlaying ? "Pause" : "Play Audio"}</span>
      </button>
      <span className="text-slate-700 font-semibold flex items-center gap-1.5 text-sm">
        <Volume2 size={16} className="text-slate-400" />
        {label}
      </span>
    </div>
  );
}
