import React from 'react';
import { LogOut, Unlock, Lock, Award, BookOpen, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { LESSONS, LessonInfo } from '../types';

interface SidebarProps {
  playerName: string;
  avatarUrl: string;
  userCode: string;
  loginType: 'STUDENT' | 'PROF';
  studentXP: number;
  completedLessons: string[];
  activeLessonId: string;
  unlockedUnits: number[];
  cloudStatus?: 'syncing' | 'synced' | 'error' | null;
  onSelectLesson: (id: string) => void;
  onLogout: () => void;
}

export default function Sidebar({
  playerName,
  avatarUrl,
  userCode,
  loginType,
  studentXP,
  completedLessons,
  activeLessonId,
  unlockedUnits,
  cloudStatus,
  onSelectLesson,
  onLogout
}: SidebarProps) {
  
  // Group lessons by units
  const units = [
    { num: 1, title: "Lesson 1 - Arriving in a foreign country" },
    { num: 2, title: "Lesson 2 - Getting to know each other" },
    { num: 3, title: "Lesson 3 - At the clothes shop" },
    { num: 4, title: "Lesson 4 - Round and about" },
    { num: 5, title: "Lesson 5 - A whole new world" },
    { num: 6, title: "Lesson 6 - Life at the office" },
    { num: 7, title: "Lesson 7 - Home sweet home" },
    { num: 8, title: "Lesson 8 - Vacations and trips" }
  ];

  const getClassName = () => {
    if (userCode.includes('T1')) return "Turma 1";
    if (userCode.includes('T2')) return "Turma 2";
    if (userCode.includes('T3')) return "Turma 3";
    return "Admin Portal";
  };

  const isUnitUnlocked = (unitNum: number) => {
    if (loginType === 'PROF') return true;
    return unlockedUnits.includes(unitNum);
  };

  return (
    <div className="w-[340px] h-screen bg-slate-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col text-slate-100 flex-shrink-0 select-none shadow-2xl relative z-20">
      
      {/* Profile summary banner */}
      <div className="p-6 bg-slate-950/40 border-b border-white/5 flex items-center gap-4">
        {loginType === 'PROF' ? (
          <div className="w-14 h-14 rounded-full bg-rose-600/90 flex items-center justify-center text-3xl shadow-lg border-2 border-rose-400">
            👨‍🏫
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full border-2 border-amber-500 overflow-hidden shadow-md flex-shrink-0">
            <img src={avatarUrl} alt={playerName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold tracking-tight text-white leading-tight truncate text-base">
            {playerName}
          </h3>
          <div className="flex items-center justify-between mt-0.5 min-h-[16px] gap-2">
            <p className="text-xs text-amber-500 font-bold uppercase tracking-wider truncate">
              {getClassName()}
            </p>
            {loginType === 'STUDENT' && cloudStatus && (
              <div className="flex items-center gap-1 text-[10px] select-none flex-shrink-0">
                {cloudStatus === 'syncing' && (
                  <span className="flex items-center gap-1 text-slate-400 font-normal">
                    <RefreshCw size={10} className="animate-spin text-slate-400" />
                    <span>Syncing...</span>
                  </span>
                )}
                {cloudStatus === 'synced' && (
                  <span className="flex items-center gap-1 text-emerald-400 font-extrabold uppercase tracking-widest text-[9px]">
                    <Cloud size={10} className="text-emerald-400" />
                    <span>Synced</span>
                  </span>
                )}
                {cloudStatus === 'error' && (
                  <span className="flex items-center gap-1 text-rose-400 font-extrabold uppercase tracking-widest text-[9px]">
                    <CloudOff size={10} className="text-rose-400" />
                    <span>Offline</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {loginType === 'STUDENT' && (
            <div className="mt-2">
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((studentXP / 1000) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                <span>Level Progress</span>
                <span>{studentXP} / 1000 XP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lesson Traill List */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin">
        {units.map((unit) => {
          const unlocked = isUnitUnlocked(unit.num);
          const unitLessons = LESSONS.filter(l => l.unit === unit.num);

          return (
            <div 
              key={unit.num} 
              className={`relative pl-6 before:absolute before:left-2 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-700 last:before:hidden ${
                unlocked ? 'opacity-100' : 'opacity-65'
              }`}
            >
              {/* Timeline Indicator Hub */}
              <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                unlocked 
                  ? 'bg-amber-500 border-white shadow-[0_0_10px_rgba(245,158,11,0.6)]' 
                  : 'bg-slate-900 border-slate-700'
              }`} />

              {/* Unit Title Header */}
              <div className={`rounded-xl p-3 border transition-all ${
                unlocked 
                  ? 'bg-amber-500/10 border-amber-500/25 text-white' 
                  : 'bg-slate-950/20 border-white/5 text-slate-400'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                  <span>{unit.title}</span>
                  {unlocked ? (
                    <Unlock size={12} className="text-amber-500" />
                  ) : (
                    <Lock size={12} className="text-slate-500" />
                  )}
                </div>
              </div>

              {/* Collapsed Lesson list */}
              {unlocked && (
                <div className="mt-2.5 space-y-1.5 pl-2">
                  {unitLessons.map((les) => {
                    const active = activeLessonId === les.id;
                    const done = completedLessons.includes(les.id);
                    return (
                      <button
                        key={les.id}
                        disabled={!unlocked}
                        onClick={() => onSelectLesson(les.id)}
                        className={`w-full flex items-center justify-between text-left py-2.5 px-3.5 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${
                          active
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-transparent text-white font-extrabold shadow-md transform translate-x-1'
                            : 'bg-slate-800/40 hover:bg-slate-800 border-transparent text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 max-w-[85%] truncate">
                          <BookOpen size={13} className={active ? "text-white" : "text-slate-400"} />
                          <span className="truncate">{les.title}</span>
                        </div>
                        {done && (
                          <Award size={13} className={active ? "text-amber-100" : "text-emerald-500"} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Log out option */}
      <button
        onClick={onLogout}
        className="w-full bg-slate-950/50 hover:bg-rose-600 hover:text-white border-t border-white/5 py-4 font-bold uppercase text-xs text-slate-500 tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <LogOut size={14} />
        <span>Log Out</span>
      </button>

    </div>
  );
}
