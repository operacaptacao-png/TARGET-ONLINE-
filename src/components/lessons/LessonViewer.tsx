import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Volume2, HelpCircle, CheckCircle2, RotateCcw, AlertCircle, BookOpen, PenTool, Check, X, Camera, RefreshCw } from 'lucide-react';
import AudioButton from '../AudioButton';
import {
  WORD_SEARCH_GRID,
  WORD_SEARCH_WORDS,
  LICAO_1C_WORDS,
  LICAO_2A_MENU,
  LICAO_2C_SCRAMBLES,
  HANGMAN_ALPHABET,
  SPELLING_ALPHABET
} from '../../data/lessonsData';

interface LessonViewerProps {
  lessonId: string;
  loginType: 'STUDENT' | 'PROF';
  onCompleteLesson: (lessonId: string, xpGained: number) => void;
  onNavigateNext: (nextId: string) => void;
}

export default function LessonViewer({ lessonId, loginType, onCompleteLesson, onNavigateNext }: LessonViewerProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [scoreModal, setScoreModal] = useState<{ show: boolean; correct: number; total: number; xp: number } | null>(null);

  // Lesson-specific states
  // 1A
  const [signDrop, setSignDrop] = useState<{ [key: string]: string }>({});
  const [matchAnswers, setMatchAnswers] = useState<{ [key: string]: string }>({});
  const [tfAnswers, setTfAnswers] = useState<{ [key: string]: 'T' | 'F' }>({});
  const [natAnswers, setNatAnswers] = useState<{ [key: string]: string }>({});
  const [hwAnswers, setHwAnswers] = useState<{ [key: string]: string }>({});
  
  // Scramble builders helper
  const [buildersAnswers, setBuildersAnswers] = useState<{ [key: string]: string[] }>({});

  // Reset tab on lesson change
  useEffect(() => {
    setActiveTab(0);
    setScoreModal(null);
  }, [lessonId]);

  // Global completeUnit hook for iframe-based lessons to submit XP and advance
  useEffect(() => {
    (window as any).completeUnit = (unitIndex: number, finalXP: number) => {
      onCompleteLesson(lessonId, finalXP);
      onNavigateNext(lessonId);
    };
    return () => {
      delete (window as any).completeUnit;
    };
  }, [lessonId, onCompleteLesson, onNavigateNext]);

  // Handle section scoring & completion
  const handleCalculate1A = () => {
    let correct = 0;
    let total = 0;

    // Sign drop zones
    const expectedSigns = { "dz-1": "w1", "dz-2": "w2", "dz-3": "w3", "dz-4": "w5", "dz-5": "w4", "dz-6": "w6", "dz-7": "w7", "dz-8": "w8" };
    Object.keys(expectedSigns).forEach(k => {
      total++;
      if (signDrop[k] === expectedSigns[k as keyof typeof expectedSigns]) correct++;
    });

    // Match questions
    const expectedMatch = { "m-1": "2", "m-2": "6", "m-3": "4", "m-4": "1", "m-5": "5", "m-6": "3", "m-7": "7" };
    Object.keys(expectedMatch).forEach(k => {
      total++;
      if (matchAnswers[k] === expectedMatch[k as keyof typeof expectedMatch]) correct++;
    });

    // T/F
    const expectedTF = { "tf-1": "T", "tf-2": "T", "tf-3": "F", "tf-4": "T", "tf-5": "T", "tf-6": "T", "tf-7": "F", "tf-8": "T" };
    Object.keys(expectedTF).forEach(k => {
      total++;
      if (tfAnswers[k] === expectedTF[k as keyof typeof expectedTF]) correct++;
    });

    // Nationalities
    const expectedNat = { "nat-1": "brazilian", "nat-2": "canadian", "nat-3": "south korean", "nat-4": "american", "nat-5": "spanish", "nat-6": "vietnamese" };
    Object.keys(expectedNat).forEach(k => {
      total++;
      if (natAnswers[k]?.trim().toLowerCase() === expectedNat[k as keyof typeof expectedNat]) correct++;
    });

    // Homework multiple choices
    const expectedHw = { "hw-1": "b", "hw-2": "b", "hw-3": "b", "hw-4": "a", "hw-5": "b", "hw-6": "b", "hw-7": "b", "hw-8": "c", "hw-9": "a", "hw-10": "a" };
    Object.keys(expectedHw).forEach(k => {
      total++;
      if (hwAnswers[k] === expectedHw[k as keyof typeof expectedHw]) correct++;
    });

    // Gained score XP ratio
    const percentage = correct / total;
    const finalXP = Math.round(percentage * 100);

    setScoreModal({ show: true, correct, total, xp: finalXP });
    onCompleteLesson(lessonId, finalXP);
  };

  // Drag and Drop helpers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDropToZone = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const wordId = e.dataTransfer.getData("text/plain");
    setSignDrop(prev => ({ ...prev, [zoneId]: wordId }));
  };

  // 1B Word Search Game States
  const [wsGridState, setWsGridState] = useState<string[][]>(WORD_SEARCH_GRID);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [wsScore, setWsScore] = useState(0);
  const [wsFoundWords, setWsFoundWords] = useState<string[]>([]);
  const [timerCount, setTimerCount] = useState(120);

  useEffect(() => {
    if (lessonId === "1B" && activeTab === 0) {
      const interval = setInterval(() => {
        setTimerCount(t => {
          if (t <= 1) {
            clearInterval(interval);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lessonId, activeTab]);

  const handleWordSearchCellMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    setSelectedCells([{ r, c }]);
  };

  const handleWordSearchCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting) return;
    const exists = selectedCells.some(cell => cell.r === r && cell.c === c);
    if (!exists) {
      setSelectedCells(prev => [...prev, { r, c }]);
    }
  };

  const handleWordSearchCellMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Build the string
    const string = selectedCells.map(cell => wsGridState[cell.r][cell.c]).join("");
    const reverseStr = string.split("").reverse().join("");

    let matched = "";
    if (WORD_SEARCH_WORDS.includes(string)) matched = string;
    else if (WORD_SEARCH_WORDS.includes(reverseStr)) matched = reverseStr;

    if (matched && !wsFoundWords.includes(matched)) {
      setWsFoundWords(prev => [...prev, matched]);
      setWsScore(prev => prev + 10);
      // Mark as found visually by updating cells or using background
    }
    setSelectedCells([]);
  };

  // 1C Spelling bee & Hangman
  const [activeSpellInputId, setActiveSpellInputId] = useState<string | null>(null);
  const [spellingAnswers, setSpellingAnswers] = useState<{ [key: string]: string }>({});
  const [hmWord, setHmWord] = useState("WORLD");
  const [hmGuesses, setHmGuesses] = useState<string[]>([]);
  const [hmErrors, setHmErrors] = useState(0);

  const handleSpellingKeyPress = (char: string) => {
    if (!activeSpellInputId) return;
    const prevVal = spellingAnswers[activeSpellInputId] || "";
    let newVal = prevVal;

    if (char === "⌫") {
      if (newVal.endsWith("-") || newVal.endsWith(" ")) {
        newVal = newVal.slice(0, -1);
      } else {
        // Remove trailing char plus its separator
        if (newVal.length > 2 && (newVal.slice(-2, -1) === "-" || newVal.slice(-2, -1) === " ")) {
          newVal = newVal.slice(0, -2);
        } else {
          newVal = newVal.slice(0, -1);
        }
      }
    } else {
      if (newVal.length === 0) {
        newVal = char;
      } else {
        if (char === " " || char === "-") {
          newVal += char;
        } else if (newVal.endsWith(" ") || newVal.endsWith("-")) {
          newVal += char;
        } else {
          newVal += "-" + char;
        }
      }
    }

    setSpellingAnswers(prev => ({ ...prev, [activeSpellInputId]: newVal }));
  };

  const handleGuessLetter = (char: string) => {
    if (hmGuesses.includes(char) || hmErrors >= 7) return;
    setHmGuesses(prev => [...prev, char]);
    if (!hmWord.includes(char)) {
      setHmErrors(err => err + 1);
    }
  };

  const isHmWon = () => {
    return hmWord.split("").every(c => hmGuesses.includes(c));
  };

  // 2C Password Guesser
  const [groceryLives, setGroceryLives] = useState(5);
  const [groceryGuesses, setGroceryGuesses] = useState<string[]>([]);
  const groceryWord = "GROCERY SHOP";

  const handleGroceryGuessLetter = (char: string) => {
    if (groceryGuesses.includes(char) || groceryLives <= 0) return;
    setGroceryGuesses(prev => [...prev, char]);
    if (!groceryWord.includes(char)) {
      setGroceryLives(l => l - 1);
    }
  };

  const isGroceryWon = () => {
    return groceryWord.split("").every(c => c === " " || groceryGuesses.includes(c));
  };

  // Scramble cards typing (2C)
  const [scrambleInputs, setScrambleInput] = useState<{ [key: string]: string }>({});

  // 3B Color paint zone dropping
  const [dropColors, setDropColors] = useState<{ [key: string]: string }>({});
  const handleDropColor = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    const color = e.dataTransfer.getData("text/plain");
    setDropColors(prev => ({ ...prev, [sectionId]: color }));
  };

  // Helper buttons to clear builder arrays
  const handleClearBuilder = (id: number) => {
    setBuildersAnswers(prev => ({ ...prev, [id]: [] }));
  };

  const handleAddBuilderWord = (id: number, word: string) => {
    const current = buildersAnswers[id] || [];
    setBuildersAnswers(prev => ({ ...prev, [id]: [...current, word] }));
  };

  const lessonKey = lessonId.toLowerCase();
  const htmlMap: Record<string, { src: string; title: string }> = {
    "1a": { src: "/licao1a.html", title: "1A | At the Airport" },
    "1b": { src: "/licao1b.html", title: "1B | Getting a Taxi" },
    "1c": { src: "/licao1c.html", title: "1C | Checking into a Hotel" },
    "1d": { src: "/licao1d.html", title: "1D | Unit 1 Grand Challenge" },
    "2a": { src: "/licao2a.html", title: "2A | Having Dinner" },
    "2b": { src: "/licao2b.html", title: "2B | Fast Food Van" },
    "2c": { src: "/licao2c.html", title: "2C | At the Grocery Shop" },
    "2d": { src: "/licao2d.html", title: "2D | Unit 2 Grand Challenge" },
    "3a": { src: "/licao3a.html", title: "3A | Shopping for Clothes" },
    "3b": { src: "/licao3b.html", title: "3B | Describing Clothes" },
    "3c": { src: "/licao3c.html", title: "3C | What to Wear" },
    "3d": { src: "/licao3d.html", title: "3D | Unit 3 Grand Challenge" },
    "4a": { src: "/licao4a.html", title: "4A | Taking a Bus" },
    "4b": { src: "/licao4b.html", title: "4B | Giving Directions" },
    "4c": { src: "/licao4c.html", title: "4C | Getting Lost" },
    "4d": { src: "/licao4d.html", title: "4D | Unit 4 Challenge" },
    "5a": { src: "/licao5a.html", title: "5A | Job Interview" },
    "5b": { src: "/licao5b.html", title: "5B | Company Culture" },
    "5c": { src: "/licao5c.html", title: "5C | Onboarding" },
    "5d": { src: "/licao5d.html", title: "5D | Unit 5 Challenge" },
    "6a": { src: "/licao6a.html", title: "6A | Daily Work Routine" },
    "6b": { src: "/licao6b.html", title: "6B | Meeting People" },
    "6c": { src: "/licao6c.html", title: "6C | After Work Dinner" },
    "6d": { src: "/licao6d.html", title: "6D | Unit 6 Challenge" },
    "7a": { src: "/licao7a.html", title: "7A | Renting a Flat" },
    "7b": { src: "/licao7b.html", title: "7B | Furnishing" },
    "7c": { src: "/licao7c.html", title: "7C | Housewarming Party" },
    "7d": { src: "/licao7d.html", title: "7D | Unit 7 Challenge" },
    "8a": { src: "/licao8a.html", title: "8A | Vacations and Trips" },
    "8b": { src: "/licao8b.html", title: "8B | Timetables" },
    "8c": { src: "/licao8c.html", title: "8C | What Comes Next?" },
    "finale": { src: "/encerramento.html", title: "Grand Finale Credits" },
    "encerramento": { src: "/encerramento.html", title: "Grand Finale Credits" }
  };

  if (htmlMap[lessonKey]) {
    return (
      <div className="flex-1 h-screen bg-transparent overflow-hidden relative z-10">
        <iframe
          src={htmlMap[lessonKey].src}
          className="w-full h-full border-none"
          title={htmlMap[lessonKey].title}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-950 text-slate-100 p-6 md:p-12 relative z-10 selection:bg-amber-500/30 font-sans">
      
      {/* Lesson Banner Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden flex items-center justify-center text-center shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center filter saturate-120 opacity-40"
            style={{ 
              backgroundImage: `url('${
                lessonId.startsWith("1") 
                  ? "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1350&q=80"
                  : lessonId.startsWith("2")
                  ? "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1350&q=80"
                  : "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1350&q=80"
              }')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="relative z-10 p-6">
            <span className="bg-amber-500 text-slate-950 py-1.5 px-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-md">
              Lesson {lessonId}
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wide text-white mt-4 drop-shadow-lg">
              {lessonId === "1A" && "At the Airport"}
              {lessonId === "1B" && "Getting a Taxi"}
              {lessonId === "1C" && "Checking into a Hotel"}
              {lessonId === "1D" && "Unit 1 Grand Challenge"}
              {lessonId === "2A" && "Having Dinner"}
              {lessonId === "2B" && "Fast Food Van"}
              {lessonId === "2C" && "At the Grocery Shop"}
              {lessonId === "2D" && "Unit 2 Grand Challenge"}
              {lessonId === "3A" && "At the Clothes Shop"}
              {lessonId === "3B" && "Describing Clothes"}
              {lessonId === "3C" && "What to Wear"}
              {lessonId === "3D" && "Unit 3 Grand Challenge"}
              {lessonId === "4A" && "Round and About"}
            </h1>
            <p className="text-slate-400 font-semibold italic text-sm md:text-base mt-2">
              {lessonId === "1A" && "Departures, Arrivals, and Onboarding Guides."}
              {lessonId === "1B" && "Navigating streets, landmarks, and there is/are checks."}
              {lessonId === "1C" && "Spelling-bees, virtual typing, and hangman checks."}
              {lessonId === "1D" && "Lock/unlock indicators, categorization checks."}
              {lessonId === "2A" && "Waiter ordered notepad, custom matching profiles."}
              {lessonId === "2B" && "Menu ordering card choices, sound recorders."}
              {lessonId === "2C" && "Portion list boxes, cashiers comic dialogue."}
              {lessonId === "2D" && "Unit final scoreboard analysis, progress updates."}
              {lessonId === "3A" && "Colors, clothing items list, T/F and roleplay writes."}
              {lessonId === "3B" && "Describing clothes, personal style, Bingo and double grouping."}
              {lessonId === "3C" && "What to wear, formal vs informal categories, color paints."}
              {lessonId === "3D" && "Categorization summary, quick quizzes, final checklist checks."}
              {lessonId === "4A" && "Bus lines, transportation, directions writing."}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Sub-Sections Panel */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-white/5 shadow-xl rounded-3xl overflow-hidden p-6 md:p-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto scrollbar-none mb-6">
          {["Words & Ideas", "Target Situation", "Language Guide", "Homework", "Final Check"].map((tabName, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`py-2 px-5 text-xs font-bold rounded-full tracking-wider uppercase whitespace-nowrap cursor-pointer transition-all ${
                activeTab === idx
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        {/* Dynamic Sub-Sections Views render check */}
        <div className="min-h-[400px]">
          {/* ==================================== */}
          {/* LESSON 1A - AT THE AIRPORT           */}
          {/* ==================================== */}
          {lessonId === "1A" && (
            <div>
              {activeTab === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <PenTool size={18} className="text-amber-500" />
                    Airport Signs Sorter
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Drag the words from the dashed box and drop them onto the matching airport icons.
                  </p>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 mb-6 text-center">
                    <div className="flex flex-wrap gap-2 justify-center" onDragOver={(e) => e.preventDefault()} onDrop={handleDropToZone}>
                      {["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"].map((id) => {
                        const words = { w1: "1. Departures", w2: "2. Arrivals", w3: "3. Baggage Claim", w4: "4. Security", w5: "5. Immigration", w6: "6. Restrooms", w7: "7. Food & Dining", w8: "8. Info Desk" };
                        // Hide if currently placed in a zone
                        const isPlaced = Object.values(signDrop).includes(id);
                        if (isPlaced) return null;
                        return (
                          <div
                            key={id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, id)}
                            className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:scale-105 transition-all shadow-md text-sm"
                          >
                            {words[id as keyof typeof words]}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { zoneId: "dz-1", label: "🛫 Departures", wordId: "w1" },
                      { zoneId: "dz-2", label: "🛬 Arrivals", wordId: "w2" },
                      { zoneId: "dz-3", label: "🧳 Baggage Claim", wordId: "w3" },
                      { zoneId: "dz-4", label: "🛂 Immigration", wordId: "w5" },
                      { zoneId: "dz-5", label: "👮 Security", wordId: "w4" },
                      { zoneId: "dz-6", label: "🚻 Restrooms", wordId: "w6" },
                      { zoneId: "dz-7", label: "🍔 Dining", wordId: "w7" },
                      { zoneId: "dz-8", label: "ℹ️ Information", wordId: "w8" }
                    ].map((zone) => (
                      <div
                        key={zone.zoneId}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropToZone(e, zone.zoneId)}
                        className="bg-slate-950 p-4 border border-slate-800 rounded-xl text-center min-h-[140px] flex flex-col items-center justify-between"
                      >
                        <span className="text-4xl block mb-2">
                          {zone.label.split(" ")[0]}
                        </span>
                        <div className="text-xs text-slate-400 font-bold mb-2">
                          {zone.label}
                        </div>
                        <div className="bg-slate-900 border border-dashed border-slate-700 w-full min-h-[46px] rounded-lg flex items-center justify-center p-1.5">
                          {signDrop[zone.zoneId] ? (
                            <div 
                              draggable
                              onDragStart={(e) => handleDragStart(e, signDrop[zone.zoneId])}
                              className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded shadow-md w-full text-center"
                            >
                              {(() => {
                                const words = { w1: "Departures", w2: "Arrivals", w3: "Baggage Claim", w4: "Security", w5: "Immigration", w6: "Restrooms", w7: "Dining", w8: "Info Desk" };
                                return words[signDrop[zone.zoneId] as keyof typeof words] || "";
                              })()}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">
                              Drop Word Here
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Volume2 size={18} className="text-amber-500" />
                    Target Situation: Meeting the Officer
                  </h3>
                  <AudioButton 
                    textToSpeak="Good morning. What is your full name? My name is Ivete Silva. Where are you from? I'm from Brazil. What do you do in Brazil? I am a sales manager. What are you doing in the UK? I'm having a job interview. Where are you going to stay? I'm going to stay in this hotel. How long are you going to stay? I'm going to stay for 1 month. Welcome to the UK. Thank you!" 
                    label="Immigration Officer & Ivete dialogue"
                  />

                  {/* Columns match questions wrapper */}
                  <div className="grid md:grid-cols-2 gap-6 bg-slate-950 p-6 rounded-2xl border border-white/5">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                        Questions
                      </h4>
                      <div className="text-sm text-slate-300 space-y-3 font-semibold leading-relaxed">
                        <div>1. What’s your full name?</div>
                        <div>2. Where are you from?</div>
                        <div>3. What do you do in Brazil?</div>
                        <div>4. What are you doing in the UK?</div>
                        <div>5. Where are you going to stay?</div>
                        <div>6. How long are you going to stay?</div>
                        <div>7. Welcome to the UK!</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">
                        Answers Match
                      </h4>
                      <div className="space-y-3">
                        {[
                          { questionKey: "m-1", text: "I'm from Brazil.", val: "2" },
                          { questionKey: "m-2", text: "I'm going to stay for 1 month.", val: "6" },
                          { questionKey: "m-3", text: "I'm having a job interview.", val: "4" },
                          { questionKey: "m-4", text: "My name is Ivete Silva.", val: "1" },
                          { questionKey: "m-5", text: "I'm going to stay in this hotel.", val: "5" },
                          { questionKey: "m-6", text: "I am a sales manager.", val: "3" },
                          { questionKey: "m-7", text: "Thank you!", val: "7" }
                        ].map((item) => (
                          <div key={item.questionKey} className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm font-semibold select-none">
                            <select
                              value={matchAnswers[item.questionKey] || ""}
                              onChange={(e) => setMatchAnswers(prev => ({ ...prev, [item.questionKey]: e.target.value }))}
                              className="bg-slate-950 border border-amber-500/30 text-amber-400 font-bold p-1 rounded min-w-[50px] text-center"
                            >
                              <option value="">-</option>
                              {["1","2","3","4","5","6","7"].map((o) => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                            <span className="text-slate-200">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* T/F Activity */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">
                      Task 2: True (T) or False (F)?
                    </h4>
                    <div className="space-y-3">
                      {[
                        { key: "tf-1", text: "1. Ivete provides her passport." },
                        { key: "tf-2", text: "2. Her full name is mentioned." },
                        { key: "tf-3", text: "3. She is from Argentina." },
                        { key: "tf-4", text: "4. She works as a sales manager." },
                        { key: "tf-5", text: "5. She is visiting for a job interview." },
                        { key: "tf-6", text: "6. She is staying in a hotel." },
                        { key: "tf-7", text: "7. She plans to stay for 3 months." },
                        { key: "tf-8", text: "8. The officer welcomes her to the UK." }
                      ].map((tf) => (
                        <div key={tf.key} className="flex items-center justify-between border-b border-white/5 py-2">
                          <span className="text-sm text-slate-200 font-medium">{tf.text}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setTfAnswers(prev => ({ ...prev, [tf.key]: 'T' }))}
                              className={`py-1 px-4 text-xs font-bold rounded-full ${
                                tfAnswers[tf.key] === 'T'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              T
                            </button>
                            <button
                              onClick={() => setTfAnswers(prev => ({ ...prev, [tf.key]: 'F' }))}
                              className={`py-1 px-4 text-xs font-bold rounded-full ${
                                tfAnswers[tf.key] === 'F'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              F
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <BookOpen size={18} className="text-amber-500" />
                    Language Guide: Organize the Scrambled Sentences
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Click the scrambled words below in order to build the Agent's questions correctly.
                  </p>

                  {[
                    { id: 1, text: "welcome to the UK", target: "welcome to the UK" },
                    { id: 2, text: "Where are you from", target: "Where are you from" },
                    { id: 3, text: "Where are you going to stay", target: "Where are you going to stay" },
                    { id: 4, text: "What are you doing in the UK", target: "What are you doing in the UK" },
                    { id: 5, text: "How long are you going to stay", target: "How long are you going to stay" },
                    { id: 6, text: "Whats your full name", target: "Whats your full name" }
                  ].map((sentence) => (
                    <div key={sentence.id} className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-3">
                      <div className="text-xs text-amber-500 font-extrabold uppercase tracking-wider">
                        Sentence {sentence.id}
                      </div>

                      {/* Display answer build result */}
                      <div className="bg-slate-900 border-2 border-dashed border-amber-500/20 rounded-lg p-3 min-h-[46px] flex flex-wrap gap-2 items-center justify-center">
                        {(buildersAnswers[sentence.id] || []).length > 0 ? (
                          (buildersAnswers[sentence.id] || []).map((word, wIdx) => (
                            <span key={wIdx} className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded text-sm">
                              {word}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 uppercase tracking-widest font-extrabold">
                            Click words below to build sentence
                          </span>
                        )}
                      </div>

                      {/* Words pool buttons */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        {sentence.text.split(" ").map((word, wordIdx) => {
                          const isUsed = (buildersAnswers[sentence.id] || []).includes(word);
                          if (isUsed) return null;
                          return (
                            <button
                              key={wordIdx}
                              onClick={() => handleAddBuilderWord(sentence.id, word)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-bold py-1.5 px-3.5 rounded-lg cursor-pointer"
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handleClearBuilder(sentence.id)}
                        className="text-xs font-bold text-rose-500 hover:underline mx-auto block cursor-pointer"
                      >
                        Reset / Clear
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Camera size={18} className="text-amber-500" />
                    Homework: Nationalities & San Francisco Visit
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Type the correct nationality for each country below.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: "nat-1", label: "🇧🇷 Brazil", ans: "brazilian" },
                      { key: "nat-2", label: "🇨🇦 Canada", ans: "canadian" },
                      { key: "nat-3", label: "🇰🇷 South Korea", ans: "south korean" },
                      { key: "nat-4", label: "🇺🇸 USA", ans: "american" },
                      { key: "nat-5", label: "🇪🇸 Spain", ans: "spanish" },
                      { key: "nat-6", label: "🇻🇳 Vietnam", ans: "vietnamese" }
                    ].map((country) => (
                      <div key={country.key} className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2 text-center">
                        <span className="font-bold text-slate-200">{country.label}</span>
                        <input
                          type="text"
                          value={natAnswers[country.key] || ""}
                          onChange={(e) => setNatAnswers(prev => ({ ...prev, [country.key]: e.target.value }))}
                          placeholder="e.g. Brazilian"
                          className="bg-slate-900 border border-slate-700 text-slate-200 py-1.5 rounded-lg text-center text-sm w-full outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Multiple choices San Francisco */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 mt-6">
                    <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-4">
                      San Francisco Dialogue Quiz
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: "hw-1", q: "1. Where is the passenger staying?", options: [{ v: "a", t: "At a friend's house" }, { v: "b", t: "At the Pacific View Hotel" }, { v: "c", t: "At the airport" }] },
                        { key: "hw-2", q: "2. Who does the passenger know in SF?", options: [{ v: "a", t: "No one" }, { v: "b", t: "Mark Ryder" }, { v: "c", t: "The officer" }] },
                        { key: "hw-3", q: "3. What is the relation to Mark?", options: [{ v: "a", t: "Family" }, { v: "b", t: "Colleague and friend" }, { v: "c", t: "Neighbors" }] },
                        { key: "hw-4", q: "4. Does she have his number?", options: [{ v: "a", t: "Yes" }, { v: "b", t: "No" }] },
                        { key: "hw-5", q: "5. What is Mark's mobile?", options: [{ v: "a", t: "4056 00 57182" }, { v: "b", t: "405-657-182" }, { v: "c", t: "415-621-8479" }] }
                      ].map((item) => (
                        <div key={item.key} className="space-y-2">
                          <label className="text-sm font-semibold text-slate-200">{item.q}</label>
                          <select
                            value={hwAnswers[item.key] || ""}
                            onChange={(e) => setHwAnswers(prev => ({ ...prev, [item.key]: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 py-2 px-3 rounded-lg text-sm text-slate-200"
                          >
                            <option value="">- Select Option -</option>
                            {item.options.map(o => (
                              <option key={o.v} value={o.v}>{o.t}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 4 && (
                <div className="space-y-6 text-center py-6">
                  <Award size={48} className="text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    Ready to Complete Lesson 1A?
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Verify all your answers in the tabs before submitting in order to check your final calculated score!
                  </p>
                  
                  <button
                    onClick={handleCalculate1A}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-10 py-4 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer uppercase text-sm tracking-wider"
                  >
                    Calculate My XP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* LESSON 1B - GETTING A TAXI           */}
          {/* ==================================== */}
          {lessonId === "1B" && (
            <div>
              {activeTab === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <PenTool size={18} className="text-amber-500" />
                      Game: London Word Search Game!
                    </h3>
                    <div className="flex gap-4">
                      <div className="bg-slate-950 px-4 py-1.5 rounded-full border border-white/5 font-extrabold text-sm text-amber-500">
                        Score: {wsScore}
                      </div>
                      <div className="bg-slate-950 px-4 py-1.5 rounded-full border border-white/5 font-extrabold text-sm text-rose-500">
                        Timer: {Math.floor(timerCount / 60)}:{(timerCount % 60).toString().padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    Find the 8 places in the town. Drag across letters horizontally or vertically to select!
                  </p>

                  <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    {/* Game Grid */}
                    <div 
                      className="grid grid-cols-10 gap-1 bg-slate-950 p-4 border border-white/5 rounded-2xl select-none touch-none"
                      onMouseLeave={handleWordSearchCellMouseUp}
                    >
                      {wsGridState.map((row, rIdx) => 
                        row.map((char, cIdx) => {
                          const isSelected = selectedCells.some(cell => cell.r === rIdx && cell.c === cIdx);
                          return (
                            <button
                              key={`${rIdx}-${cIdx}`}
                              onMouseDown={() => handleWordSearchCellMouseDown(rIdx, cIdx)}
                              onMouseEnter={() => handleWordSearchCellMouseEnter(rIdx, cIdx)}
                              onMouseUp={handleWordSearchCellMouseUp}
                              className={`w-8 h-8 rounded font-black text-sm uppercase flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 scale-105 shadow-md shadow-amber-500/25'
                                  : 'bg-slate-900 border border-slate-800 text-slate-200'
                              }`}
                            >
                              {char}
                            </button>
                          );
                        })
                      )}
                    </div>

                    {/* Left Targets */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex-1 min-w-[200px]">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">
                        Target Words
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {WORD_SEARCH_WORDS.map(word => {
                          const found = wsFoundWords.includes(word);
                          return (
                            <div
                              key={word}
                              className={`py-2 px-3 rounded-lg text-xs font-bold text-center border transition-all ${
                                found
                                  ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 line-through'
                                  : 'bg-slate-900 border-white/5 text-slate-400'
                              }`}
                            >
                              {word}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <Volume2 size={18} className="text-amber-500" />
                    Target Situation: Taxi Ride Dialogue
                  </h3>
                  <AudioButton 
                    textToSpeak="What is there nearby? There is Trafalgar Square. It is beautiful. Also there is the London Bridge. In London there are nice churches and towers nearby." 
                    label="Ivete's Taxi Ride ambient talk"
                  />

                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4">
                    <p className="text-sm text-slate-300">
                      Based on your listening, type down the correct places:
                    </p>
                    <div className="space-y-4 leading-relaxed font-semibold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>a) A beautiful</span>
                        <input type="text" placeholder="place/square" className="bg-slate-900 border border-slate-700 py-1 px-3 rounded text-sm w-36" />
                        <span>. Its name is Trafalgar.</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>b) A long</span>
                        <input type="text" placeholder="bridge" className="bg-slate-900 border border-slate-700 py-1 px-3 rounded text-sm w-32" />
                        <span>. The London bridge.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab >= 2 && (
                <div className="space-y-6 text-center py-6">
                  <Award size={48} className="text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    Ready to Complete Lesson 1B?
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Verify all your answers in the tabs before submitting in order to check your final calculated score!
                  </p>
                  
                  <button
                    onClick={() => {
                      setScoreModal({ show: true, correct: 8, total: 8, xp: 100 });
                      onCompleteLesson(lessonId, 100);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-10 py-4 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer uppercase text-sm tracking-wider"
                  >
                    Calculate My XP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* LESSON 1C - AT THE HOTEL             */}
          {/* ==================================== */}
          {lessonId === "1C" && (
            <div>
              {activeTab === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <PenTool size={18} className="text-amber-500" />
                    Hotel Room Check Warm-up
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Look at the hotel desk check image check list. Group the correct reservation item cards!
                  </p>
                  
                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 flex flex-wrap gap-2 justify-center">
                    {LICAO_1C_WORDS.map((w, idx) => (
                      <div key={idx} className="bg-slate-900 border border-white/5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-200">
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <PenTool size={18} className="text-amber-500" />
                    Interactive Spelling-Bee Keyboard
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Click each field, then use the visual letters to spell your names correctly.
                  </p>

                  <div className="space-y-4">
                    {[
                      { key: "sp-1", label: "1. Spell your full name" },
                      { key: "sp-2", label: "2. Spell your last name" },
                      { key: "sp-3", label: "3. Spell: Feira de Santana" }
                    ].map(field => (
                      <div key={field.key} className="space-y-1.5">
                        <label className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          readOnly
                          onClick={() => setActiveSpellInputId(field.key)}
                          value={spellingAnswers[field.key] || ""}
                          placeholder="Click here then type on spelling keyboard below..."
                          className={`w-full bg-slate-950 border text-white p-3.5 rounded-xl font-mono text-center text-sm outline-none cursor-pointer transition-all ${
                            activeSpellInputId === field.key ? 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-500/5' : 'border-stone-800'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Keyboard keys */}
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mx-auto">
                      {SPELLING_ALPHABET.split("").map((char) => (
                        <button
                          key={char}
                          onClick={() => handleSpellingKeyPress(char)}
                          className="w-10 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                        >
                          {char === " " ? "_" : char}
                        </button>
                      ))}
                      <button
                        onClick={() => handleSpellingKeyPress("⌫")}
                        className="w-16 h-10 bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold rounded-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                      >
                        Backspace
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                    <PenTool size={18} className="text-amber-500" />
                    Interactive Hangman Game
                  </h3>
                  <p className="text-sm text-slate-400 italic">
                    Guess the letters to solve the 5-letter hotel vocabulary word before the hangman gets complete! Uses 7 maximum attempts.
                  </p>

                  <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-slate-950 p-8 rounded-3xl border border-white/5">
                    {/* SVG Drawn Hangman */}
                    <div className="w-[140px] h-[190px] relative border-b-4 border-slate-700">
                      {/* Pole */}
                      {hmErrors >= 1 && <div className="absolute left-[30px] bottom-0 top-0 w-1 bg-slate-700" />}
                      {/* Top Bar */}
                      {hmErrors >= 2 && <div className="absolute left-[30px] top-[10px] w-20 h-1 bg-slate-700" />}
                      {/* Rope */}
                      {hmErrors >= 3 && <div className="absolute left-[106px] top-[10px] w-0.5 h-6 bg-amber-600/80" />}
                      {/* Head */}
                      {hmErrors >= 4 && <div className="absolute left-[97px] top-[34px] w-5 h-5 rounded-full border-2 border-amber-500" />}
                      {/* Spine */}
                      {hmErrors >= 5 && <div className="absolute left-[106px] top-[54px] w-0.5 h-12 bg-amber-500/80" />}
                      {/* Arm left */}
                      {hmErrors >= 6 && <div className="absolute left-[95px] top-[64px] w-12 h-0.5 bg-amber-500/80 rotate-45" />}
                      {/* Legs */}
                      {hmErrors >= 7 && <div className="absolute left-[95px] top-[104px] w-12 h-0.5 bg-amber-500/80 -rotate-45" />}
                    </div>

                    <div className="flex-1 text-center space-y-6">
                      <div className="text-3xl font-black font-mono tracking-widest text-slate-100">
                        {hmWord.split("").map((c, i) => (hmGuesses.includes(c) ? c : "_")).join(" ")}
                      </div>

                      <div className="flex flex-wrap gap-1.5 justify-center max-w-sm mx-auto">
                        {HANGMAN_ALPHABET.split("").map((char) => {
                          const guessed = hmGuesses.includes(char);
                          const isCorrect = hmWord.includes(char);
                          return (
                            <button
                              key={char}
                              disabled={guessed || hmErrors >= 7 || isHmWon()}
                              onClick={() => handleGuessLetter(char)}
                              className={`w-8 h-8 rounded font-black text-xs cursor-pointer transition-all ${
                                guessed
                                  ? isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-rose-600 text-white'
                                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {char}
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-sm font-bold uppercase tracking-wider h-6">
                        {isHmWon() && <span className="text-emerald-400">🎉 Congratulations! You guessed correctly!</span>}
                        {hmErrors >= 7 && <span className="text-rose-500">❌ Game Over! The word was {hmWord}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab >= 3 && (
                <div className="space-y-6 text-center py-6">
                  <Award size={48} className="text-amber-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide">
                    Ready to Complete Lesson 1C?
                  </h3>
                  <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Verify all your answers in the tabs before submitting in order to check your final calculated score!
                  </p>
                  
                  <button
                    onClick={() => {
                      setScoreModal({ show: true, correct: 10, total: 10, xp: 100 });
                      onCompleteLesson(lessonId, 100);
                    }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-10 py-4 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer uppercase text-sm tracking-wider"
                  >
                    Calculate My XP
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* OTHER LESSON SHARDS FALLBACKS        */}
          {/* ==================================== */}
          {lessonId !== "1A" && lessonId !== "1B" && lessonId !== "1C" && (
            <div className="text-center py-12 space-y-6">
              <BookOpen size={48} className="text-amber-500 mx-auto animate-pulse" />
              <h3 className="text-xl font-black uppercase text-white">
                Interactive Practice Hub: {lessonId}
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Welcome to active portal practice for Lesson {lessonId}. Pull interactive grids, exercises, checklists, and dialogues now.
              </p>

              {lessonId === "2A" && (
                <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 space-y-4 text-left max-w-md mx-auto">
                  <h4 className="text-xs uppercase font-extrabold text-amber-500 tracking-wider">
                    Task Selection: Ordering Soup or Spaghetti
                  </h4>
                  <p className="text-xs text-slate-400">
                    Use order comanda notes to check of food portions:
                  </p>
                  <div className="space-y-2">
                    {["Can I have a tomato soup, please?", "I'd like spaghetti & meatballs for my dinner."].map((sentence, idx) => (
                      <div key={idx} className="bg-slate-900 px-3 py-2 rounded border border-white/5 text-xs text-slate-200">
                        {sentence}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lessonId === "2C" && (
                <div className="space-y-6">
                  {/* Virtual Password Game */}
                  <div className="bg-slate-950 p-6 rounded-3xl border border-white/5 max-w-lg mx-auto">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">
                      Password Guesser (Lives: {groceryLives})
                    </div>
                    <div className="text-2xl font-black tracking-widest font-mono mb-4 text-white">
                      {groceryWord.split("").map((c, i) => (c === " " ? "  " : groceryGuesses.includes(c) ? c : "_")).join(" ")}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
                        <button
                          key={char}
                          disabled={groceryGuesses.includes(char) || groceryLives <= 0 || isGroceryWon()}
                          onClick={() => handleGroceryGuessLetter(char)}
                          className="w-8 h-8 text-xs font-bold bg-slate-900 text-white rounded hover:bg-slate-800"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {lessonId === "3B" && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropColor(e, "group-1")}
                      className="h-24 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center p-2 text-center text-xs text-slate-400 font-bold"
                      style={{ backgroundColor: dropColors["group-1"] || "transparent" }}
                    >
                      {dropColors["group-1"] ? "Color dropped!" : "Drag color dot here (Group 1)"}
                    </div>
                    <div 
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropColor(e, "group-2")}
                      className="h-24 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center p-2 text-center text-xs text-slate-400 font-bold"
                      style={{ backgroundColor: dropColors["group-2"] || "transparent" }}
                    >
                      {dropColors["group-2"] ? "Color dropped!" : "Drag color dot here (Group 2)"}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {["#ef4444", "#3b82f6", "#10b981", "#af55f7"].map((col) => (
                      <div
                        key={col}
                        draggable
                        onDragStart={(e) => handleDragStart(e, col)}
                        className="w-10 h-10 rounded-full cursor-grab active:cursor-grabbing border border-white"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setScoreModal({ show: true, correct: 10, total: 10, xp: 100 });
                  onCompleteLesson(lessonId, 100);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-3 rounded-full cursor-pointer uppercase text-xs tracking-wider"
              >
                Log XP Completion
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Cinematic completion popup modal */}
      <AnimatePresence>
        {scoreModal?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-stone-900 border border-white/10 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl"
            >
              <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                Mission Complete!
              </h2>
              <p className="text-slate-400 font-medium text-xs uppercase tracking-wider mt-1">
                Lesson {lessonId} successfully finished
              </p>

              <div className="w-28 h-28 rounded-full bg-emerald-500 font-extrabold text-3xl text-white flex items-center justify-center border-[8px] border-emerald-500/20 mx-auto my-6 shadow-xl shadow-emerald-500/10">
                +{scoreModal.xp} XP
              </div>

              <p className="text-xs text-slate-400 font-bold uppercase mb-6">
                You scored {scoreModal.correct} out of {scoreModal.total} correct steps.
              </p>

              <button
                onClick={() => {
                  setScoreModal(null);
                  onNavigateNext(lessonId);
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3 rounded-full cursor-pointer uppercase text-xs tracking-widest tracking-normal transition-transform active:scale-95 shadow-md shadow-emerald-500/15"
              >
                Collect Rewards
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
