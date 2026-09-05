import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VALID_CODES } from '../types';

interface ImmigrationScreenProps {
  onComplete: (data: { playerName: string; avatarUrl: string; userCode: string; loginType: 'STUDENT' | 'PROF' }) => void;
}

const AVATARS = [
  { id: 1, name: "Adriane", url: "https://i.postimg.cc/pVKGSvYX/Adriane.jpg" },
  { id: 2, name: "Jorge", url: "https://i.postimg.cc/qv1ZGGcp/Jorge.jpg" },
  { id: 3, name: "Luna", url: "https://i.postimg.cc/6QTbbGYJ/Luna.jpg" },
  { id: 4, name: "Matheus", url: "https://i.postimg.cc/yN5QMYbd/MAtheus.jpg" },
  { id: 5, name: "Wellinton", url: "https://i.postimg.cc/c4Z9yzXY/Wellinton.jpg" },
  { id: 6, name: "Sarah", url: "https://i.postimg.cc/hjdycWkX/Sarah.jpg" }
];

const NARRATIVE_PHRASES = [
  "Existem momentos na vida em que tudo muda…",
  "Não porque estamos prontos…",
  "Mas porque ficar já não é mais uma opção.",
  "Entre sonhos...",
  "Você escolheu viver esse sonho...",
  "LONDRES."
];

export default function ImmigrationScreen({ onComplete }: ImmigrationScreenProps) {
  const [step, setStep] = useState<'avatar' | 'narrative' | 'interview' | 'welcome'>('avatar');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  
  // Form states
  const [name, setName] = useState('');
  const [passportCode, setPassportCode] = useState('');
  const [interviewStep, setInterviewStep] = useState<1 | 2>(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle avatar select
  const handleConfirmAvatar = () => {
    if (!selectedAvatar) return;
    setStep('narrative');
    startNarrativeSequence();
  };

  // Narrative timer loop
  const startNarrativeSequence = () => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < NARRATIVE_PHRASES.length) {
        setNarrativeIndex(index);
      } else {
        clearInterval(interval);
        setStep('interview');
      }
    }, 2800);
  };

  // Form handlers
  const handleNameNext = () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    setInterviewStep(2);
  };

  const handlePassportEnter = () => {
    const code = passportCode.trim().toUpperCase();
    if (!VALID_CODES.includes(code)) {
      setErrorMsg("Invalid Passport or Teacher Code. Please try again.");
      return;
    }

    const type = code.includes('PROF') ? 'PROF' : 'STUDENT';
    const finalName = type === 'PROF' ? 'Master Teacher' : name;
    
    // Jump with a cinematic welcome splash
    setStep('welcome');
    setTimeout(() => {
      onComplete({
        playerName: finalName,
        avatarUrl: selectedAvatar || AVATARS[0].url,
        userCode: code,
        loginType: type
      });
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 font-sans text-white overflow-hidden select-none">
      {/* Background airplane illustration ambient wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-opacity duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80')` }}
      />

      <AnimatePresence mode="wait">
        {/* STEP 1: AVATAR SELECT */}
        {step === 'avatar' && (
          <motion.div
            key="avatar-select"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-11/12 max-w-2xl bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shadow-2xl"
          >
            <h2 className="text-xl md:text-3xl font-bold font-display uppercase tracking-widest text-amber-500 mb-6 drop-shadow-md">
              Choose Your Avatar
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {AVATARS.map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`relative aspect-[4/5] rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                    selectedAvatar === av.url 
                      ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
                      : 'border-white/15'
                  }`}
                >
                  <img 
                    src={av.url} 
                    alt={av.name} 
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selectedAvatar === av.url ? 'brightness-110 grayscale-0' : 'brightness-50 grayscale-[15%]'
                    }`}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
                    {av.name}
                  </div>
                </div>
              ))}
            </div>

            {selectedAvatar && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleConfirmAvatar}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-8 py-3.5 rounded-full cursor-pointer transition-all shadow-lg hover:shadow-orange-500/25 tracking-wider uppercase text-sm"
              >
                Start Journey
              </motion.button>
            )}
          </motion.div>
        )}

        {/* STEP 2: GERMAN/PORTUGUESE CINEMATIC INTRO */}
        {step === 'narrative' && (
          <motion.div
            key="narrative-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center px-6 max-w-4xl"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={narrativeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8 }}
                className={`text-2xl md:text-4xl tracking-wide leading-relaxed font-light ${
                  NARRATIVE_PHRASES[narrativeIndex] === 'LONDRES.' 
                    ? 'text-5xl md:text-7xl font-extrabold text-amber-500 uppercase tracking-widest' 
                    : 'text-slate-100'
                }`}
              >
                {NARRATIVE_PHRASES[narrativeIndex]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 3: IMMIGRATION OFFICE INTERVIEW */}
        {step === 'interview' && (
          <motion.div
            key="interview-card"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="relative z-10 w-11/12 max-w-md bg-stone-950/90 backdrop-blur-xl border-l-4 border-amber-500 border-y border-r border-white/5 py-10 px-8 rounded-2xl shadow-2xl text-center"
          >
            <div className="uppercase tracking-widest text-xs font-bold text-amber-500 mb-2">
              Immigration Officer (London Heath)
            </div>

            <AnimatePresence mode="wait">
              {interviewStep === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-xl text-slate-100 font-light leading-relaxed">
                    "Good morning. What is your full name?"
                  </p>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Type your name..."
                    className="w-full bg-transparent border-b-2 border-slate-700 focus:border-amber-500 text-center text-xl pb-2 outline-none transition-colors text-white placeholder-slate-600 uppercase"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
                  />
                  <button
                    onClick={handleNameNext}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer uppercase text-sm tracking-wider"
                  >
                    Next
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-xl text-slate-100 font-light leading-relaxed">
                    "Welcome... <span className="text-amber-500 font-bold uppercase">{name}</span>. What is your passport code?"
                  </p>
                  <input
                    type="text"
                    value={passportCode}
                    onChange={(e) => setPassportCode(e.target.value)}
                    placeholder="TARGET1ON-XXXX"
                    className="w-full bg-transparent border-b-2 border-slate-700 focus:border-amber-500 text-center text-xl pb-2 outline-none transition-colors text-white placeholder-slate-600 uppercase tracking-wider"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handlePassportEnter()}
                  />
                  {errorMsg && (
                    <p className="text-rose-500 font-bold text-sm bg-rose-500/10 py-2 rounded-lg">
                      {errorMsg}
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setInterviewStep(1)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-8 rounded-full cursor-pointer uppercase text-sm tracking-wider transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePassportEnter}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer uppercase text-sm tracking-wider"
                    >
                      Enter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 4: CINEMATIC WELCOME SPLASH */}
        {step === 'welcome' && (
          <motion.div
            key="welcome-splash"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-widest uppercase">
              Welcome to
              <span className="block text-6xl md:text-8xl font-black text-amber-500 mt-2 tracking-normal drop-shadow-lg">
                TARGET ON
              </span>
            </h1>
            <p className="text-slate-400 font-semibold tracking-wider uppercase mt-4 text-xs">
              Preparing your classroom...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
