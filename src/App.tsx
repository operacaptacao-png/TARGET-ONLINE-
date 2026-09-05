import React, { useState, useEffect } from 'react';
import { AppState, VALID_CODES, LESSONS } from './types';
import Sidebar from './components/Sidebar';
import LessonViewer from './components/lessons/LessonViewer';
import JourneyTransition from './components/JourneyTransition';
import ImmigrationScreen from './components/ImmigrationScreen';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const savedName = localStorage.getItem('userName');
    const savedAvatar = localStorage.getItem('userAvatar');
    const savedCode = localStorage.getItem('userCode');
    const savedType = localStorage.getItem('userLoginType') as 'STUDENT' | 'PROF' | null;
    const savedXP = localStorage.getItem('studentXP');
    const savedComp = localStorage.getItem('completedLessons');
    const savedUnl = localStorage.getItem('unlockedUnits');
    const savedActive = localStorage.getItem('activeLessonId');

    return {
      playerName: savedName || '',
      avatarUrl: savedAvatar || 'https://i.postimg.cc/pVKGSvYX/Adriane.jpg',
      userCode: savedCode || '',
      loginType: savedType || null,
      studentXP: savedXP ? parseInt(savedXP) : 0,
      completedLessons: savedComp ? JSON.parse(savedComp) : [],
      unlockedUnits: savedUnl ? JSON.parse(savedUnl) : [1],
      activeLessonId: savedActive || '1A'
    };
  });

  // Track interface cinematic transitions and cloud state integration
  const [transitionType, setTransitionType] = useState<"TRANSITION_1" | "TRANSITION_2" | "TRANSITION_3" | null>(null);
  const [cloudStatus, setCloudStatus] = useState<'syncing' | 'synced' | 'error' | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('userName', state.playerName);
    localStorage.setItem('userAvatar', state.avatarUrl);
    localStorage.setItem('userCode', state.userCode);
    localStorage.setItem('userLoginType', state.loginType || '');
    localStorage.setItem('studentXP', state.studentXP.toString());
    localStorage.setItem('completedLessons', JSON.stringify(state.completedLessons));
    localStorage.setItem('unlockedUnits', JSON.stringify(state.unlockedUnits));
    localStorage.setItem('activeLessonId', state.activeLessonId);
  }, [state]);

  // Synchronize state and registration changes with the Cloud Google Sheets
  useEffect(() => {
    if (!state.userCode || state.loginType !== 'STUDENT' || !state.playerName) return;

    let isMounted = true;
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPnScrpyBKJxI3hvG1S7u2s2COsH7vLDnf1AvTWDdLNTvL88kTmLVR4CGyv_nZtcaXZw/exec";

    let className = "Turma Desconhecida";
    if (state.userCode.includes('T1')) className = "Turma 1";
    else if (state.userCode.includes('T2')) className = "Turma 2";
    else if (state.userCode.includes('T3')) className = "Turma 3";

    const payload = {
      code: state.userCode,
      name: state.playerName,
      turma: className,
      xp: state.studentXP,
      unit1: state.completedLessons.includes("1D"),
      unit2: state.completedLessons.includes("2D"),
      unit3: state.completedLessons.includes("3D"),
      unit4: state.completedLessons.includes("4D"),
      unit5: false,
      unit6: false,
      unit7: false,
      unit8: false
    };

    setCloudStatus('syncing');

    // Debounce/throttle wrapper to prevent multiple parallel spam fetches
    const timerId = setTimeout(() => {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          if (isMounted) {
            console.log("Successfully synced with Google Sheets cloud:", data);
            setCloudStatus('synced');
          }
        })
        .catch(err => {
          console.warn("Could not reach Cloud Sheets Sync (running in fallback state):", err);
          if (isMounted) {
            setCloudStatus('error');
          }
        });
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [state.playerName, state.userCode, state.loginType, state.studentXP, state.completedLessons]);

  const handleOnboardingComplete = (data: { playerName: string; avatarUrl: string; userCode: string; loginType: 'STUDENT' | 'PROF' }) => {
    setState(prev => ({
      ...prev,
      playerName: data.playerName,
      avatarUrl: data.avatarUrl,
      userCode: data.userCode,
      loginType: data.loginType,
      // unlocked all units instantly for Prof
      unlockedUnits: data.loginType === 'PROF' ? [1, 2, 3, 4] : [1]
    }));
  };

  const handleCompleteLesson = (completedId: string, xpGained: number) => {
    setState(prev => {
      // Avoid duplicate lists
      const completed = prev.completedLessons.includes(completedId)
        ? prev.completedLessons
        : [...prev.completedLessons, completedId];

      const newXP = prev.studentXP + xpGained;
      const updatedUnlocked = [...prev.unlockedUnits];

      // Check unit completes to trigger lock progression
      if (completedId === "1D" && !updatedUnlocked.includes(2)) {
        updatedUnlocked.push(2);
      }
      if (completedId === "2D" && !updatedUnlocked.includes(3)) {
        updatedUnlocked.push(3);
      }
      if (completedId === "3D" && !updatedUnlocked.includes(4)) {
        updatedUnlocked.push(4);
      }

      return {
        ...prev,
        completedLessons: completed,
        studentXP: newXP,
        unlockedUnits: updatedUnlocked
      };
    });
  };

  // Intermediate route controllers
  const handleNavigateNext = (currentLessonId: string) => {
    if (state.loginType === 'PROF') {
      // Just progress linearly for teachers
      let nextId = "1A";
      if (currentLessonId === "1A") nextId = "1B";
      else if (currentLessonId === "1B") nextId = "1C";
      else if (currentLessonId === "1C") nextId = "1D";
      else if (currentLessonId === "1D") nextId = "2A";
      else if (currentLessonId === "2A") nextId = "2B";
      else if (currentLessonId === "2B") nextId = "2C";
      else if (currentLessonId === "2C") nextId = "2D";
      else if (currentLessonId === "2D") nextId = "3A";
      else if (currentLessonId === "3A") nextId = "3B";
      else if (currentLessonId === "3B") nextId = "3C";
      else if (currentLessonId === "3C") nextId = "3D";
      else if (currentLessonId === "3D") nextId = "4A";

      setState(prev => ({ ...prev, activeLessonId: nextId }));
      return;
    }

    // Trigger transition journey videos for students completing whole unit checkpoints!
    if (currentLessonId === "1D") {
      setTransitionType("TRANSITION_1");
    } else if (currentLessonId === "2D") {
      setTransitionType("TRANSITION_2");
    } else if (currentLessonId === "3D") {
      setTransitionType("TRANSITION_3");
    } else {
      // Normal progression logic
      let nextId = "1A";
      if (currentLessonId === "1A") nextId = "1B";
      else if (currentLessonId === "1B") nextId = "1C";
      else if (currentLessonId === "1C") nextId = "1D";
      else if (currentLessonId === "2A") nextId = "2B";
      else if (currentLessonId === "2B") nextId = "2C";
      else if (currentLessonId === "2C") nextId = "2D";
      else if (currentLessonId === "3A") nextId = "3B";
      else if (currentLessonId === "3B") nextId = "3C";
      else if (currentLessonId === "3C") nextId = "3D";

      setState(prev => ({ ...prev, activeLessonId: nextId }));
    }
  };

  const handleProceedTransition = () => {
    let nextId = "2A";
    if (transitionType === "TRANSITION_1") nextId = "2A";
    else if (transitionType === "TRANSITION_2") nextId = "3A";
    else if (transitionType === "TRANSITION_3") nextId = "4A";

    setState(prev => ({ ...prev, activeLessonId: nextId }));
    setTransitionType(null);
  };

  const handleSelectLesson = (id: string) => {
    setState(prev => ({ ...prev, activeLessonId: id }));
  };

  const handleLogout = () => {
    localStorage.clear();
    setState({
      playerName: '',
      avatarUrl: 'https://i.postimg.cc/pVKGSvYX/Adriane.jpg',
      userCode: '',
      loginType: null,
      studentXP: 0,
      completedLessons: [],
      unlockedUnits: [1],
      activeLessonId: '1A'
    });
  };

  // Check onboarding lock trigger
  const hasOnboarded = state.playerName && state.userCode && state.loginType;

  if (!hasOnboarded) {
    return <ImmigrationScreen onComplete={handleOnboardingComplete} />;
  }

  // Render transitions
  if (transitionType) {
    return <JourneyTransition transitionType={transitionType} onProceed={handleProceedTransition} />;
  }

  return (
    <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar
        playerName={state.playerName}
        avatarUrl={state.avatarUrl}
        userCode={state.userCode}
        loginType={state.loginType!}
        studentXP={state.studentXP}
        completedLessons={state.completedLessons}
        activeLessonId={state.activeLessonId}
        unlockedUnits={state.unlockedUnits}
        cloudStatus={cloudStatus}
        onSelectLesson={handleSelectLesson}
        onLogout={handleLogout}
      />

      {/* Primary Lessons content container viewport */}
      <div className="flex-1 h-screen overflow-hidden">
        <LessonViewer
          lessonId={state.activeLessonId}
          loginType={state.loginType!}
          onCompleteLesson={handleCompleteLesson}
          onNavigateNext={handleNavigateNext}
        />
      </div>

    </div>
  );
}
