import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ArrowRight } from 'lucide-react';

interface JourneyTransitionProps {
  transitionType: "TRANSITION_1" | "TRANSITION_2" | "TRANSITION_3";
  onProceed: () => void;
}

export default function JourneyTransition({ transitionType, onProceed }: JourneyTransitionProps) {
  const [step, setStep] = useState(0);
  const [showMainContents, setShowMainContents] = useState(false);

  // Autumn leaves helper list
  const [leaves, setLeaves] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);
  // Rain helper list
  const [raindrops, setRaindrops] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    if (transitionType === "TRANSITION_1") {
      const generatedLeaves = Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        size: Math.random() * 15 + 10
      }));
      setLeaves(generatedLeaves);
    } else if (transitionType === "TRANSITION_2") {
      const generatedDrops = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 0.8 + 0.4
      }));
      setRaindrops(generatedDrops);
    }
  }, [transitionType]);

  const handleStartTransition = () => {
    setShowMainContents(true);
    // Play ambient rain/wind synthesized read check for complete immersive experience
    if (transitionType === "TRANSITION_2") {
      const utterance = new SpeechSynthesisUtterance("It wasn't this cold in Brazil... I think I need some new clothes.");
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    } else if (transitionType === "TRANSITION_3") {
      const utterance = new SpeechSynthesisUtterance("I really want to visit the British Museum... But it's so far away... I'm going to be brave and take a bus.");
      utterance.lang = 'en-GB';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 font-sans text-white overflow-hidden select-none">
      
      {/* Background themed graphic wraps */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 filter saturate-100"
        style={{ 
          backgroundImage: `url('${
            transitionType === "TRANSITION_1"
              ? "https://images.unsplash.com/photo-1507006085698-3286b24f5cbe?auto=format&fit=crop&w=1920&q=80"
              : transitionType === "TRANSITION_2"
              ? "https://images.unsplash.com/photo-1513622470522-26c308a201f8?auto=format&fit=crop&w=1920&q=80"
              : "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80"
          }')` 
        }}
      />
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Autumn leaves falling animation render checks */}
      {transitionType === "TRANSITION_1" && showMainContents && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {leaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{ y: -100, x: `${leaf.left}vw`, rotate: 0 }}
              animate={{ 
                y: "110vh", 
                x: `${leaf.left + 15}vw`,
                rotate: 720 
              }}
              transition={{
                duration: 8,
                delay: leaf.delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: leaf.size,
                height: leaf.size,
                background: leaf.id % 2 === 0 ? '#e67e22' : '#f1c40f',
                borderRadius: "0% 50% 0% 50%"
              }}
              className="absolute shadow-lg shadow-black/20"
            />
          ))}
        </div>
      )}

      {/* Falling raindrops rendering checks */}
      {transitionType === "TRANSITION_2" && showMainContents && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {raindrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ y: -100, x: `${drop.left}vw` }}
              animate={{ y: "110vh" }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: "1.5px",
                height: "60px",
                background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.45))"
              }}
              className="absolute"
            />
          ))}
        </div>
      )}

      {/* Primary overlay content */}
      <div className="relative z-20 text-center max-w-xl px-6">
        <AnimatePresence mode="wait">
          {!showMainContents ? (
            <motion.div
              key="start-btn"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold uppercase tracking-widest text-amber-500">
                {transitionType === "TRANSITION_1" && "Entering Autumn forest"}
                {transitionType === "TRANSITION_2" && "Stormy weather warning"}
                {transitionType === "TRANSITION_3" && "The Bus Station Station"}
              </h2>
              <button
                onClick={handleStartTransition}
                className="bg-transparent border border-white hover:bg-white hover:text-slate-900 py-3.5 px-10 rounded-full font-bold uppercase text-xs tracking-wider cursor-pointer transition-all active:scale-95"
              >
                Start Next Journey ➔
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="stage-narratives"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {transitionType === "TRANSITION_1" && (
                <div className="space-y-4">
                  <span className="bg-amber-600/90 text-white font-extrabold uppercase py-1 px-4 text-2s rounded-full tracking-widest shadow-md">
                    Lesson - 2A
                  </span>
                  <h1 className="text-5xl font-black text-amber-500 uppercase tracking-widest drop-shadow-md">
                    SHOPPING FOR FOOD
                  </h1>
                  <h3 className="text-2xl font-light text-slate-200">
                    Having Dinner
                  </h3>
                  <p className="text-slate-400 font-medium italic text-sm text-center leading-relaxed max-w-sm mx-auto">
                    "Welcome to London. I don't know about you... Aren't you hungry... Let's eat?"
                  </p>
                </div>
              )}

              {transitionType === "TRANSITION_2" && (
                <div className="space-y-4">
                  <span className="bg-blue-600/95 text-white font-extrabold uppercase py-1 px-4 text-2s rounded-full tracking-widest shadow-md">
                    Lesson - 3
                  </span>
                  <h1 className="text-5xl font-black text-sky-400 uppercase tracking-widest drop-shadow-md border-b-2 border-dashed border-sky-400/20 pb-4">
                    AT THE CLOTHES SHOP
                  </h1>
                  <h3 className="text-2xl font-light text-slate-200 mt-2">
                    Shopping for clothes
                  </h3>
                  <p className="text-slate-300 font-medium italic text-sm text-center leading-relaxed max-w-sm mx-auto">
                    "It wasn't this cold in Brazil... I think I need some new clothes."
                  </p>
                </div>
              )}

              {transitionType === "TRANSITION_3" && (
                <div className="space-y-4">
                  <span className="bg-red-600/95 text-white font-extrabold uppercase py-1 px-4 text-2s rounded-full tracking-widest shadow-md">
                    Lesson - 4A
                  </span>
                  <h1 className="text-5xl font-black text-red-500 uppercase tracking-widest drop-shadow-md">
                    ROUND AND ABOUT
                  </h1>
                  <h3 className="text-2xl font-light text-slate-200 mt-2">
                    Museum Station
                  </h3>
                  <div className="text-slate-200 font-semibold italic text-base space-y-2 mt-4">
                    <p>"I really want to visit the <b>British Museum</b>..."</p>
                    <p>"But it's so far away..."</p>
                    <p>"I'm going to be brave and <b>take a bus</b>."</p>
                  </div>
                </div>
              )}

              <button
                onClick={onProceed}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full flex mx-auto items-center gap-2 hover:bg-white hover:text-slate-950 transition-colors uppercase text-xs tracking-wider cursor-pointer"
              >
                <span>Enter Lesson</span>
                <ArrowRight size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
