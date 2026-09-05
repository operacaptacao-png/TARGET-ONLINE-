export interface AppState {
  playerName: string;
  avatarUrl: string;
  userCode: string;
  loginType: 'STUDENT' | 'PROF' | null;
  studentXP: number;
  completedLessons: string[];
  unlockedUnits: number[];
  activeLessonId: string; // e.g. "1A", "1B", "TRANSITION_1", etc.
}

export const VALID_CODES = [
  "T1ONPROF1", "T2ONPROF2", "T3ONPROFT3", "PROF", "PROFESSOR", "ADMIN", "TEACHER",
  "TARGET1ONT1-A9X2", "TARGET1ONT1-B7M4", "TARGET1ONT1-C3K9", "TARGET1ONT1-D8R1", "TARGET1ONT1-E5P6", "TARGET1ONT1-F2W8", "TARGET1ONT1-G4L3", "TARGET1ONT1-H1V7",
  "TARGET1ONT2-X1Q9", "TARGET1ONT2-Y8Z3", "TARGET1ONT2-Z5N2", "TARGET1ONT2-W7C4", "TARGET1ONT2-V3B8", "TARGET1ONT2-U6M1", "TARGET1ONT2-T2K5", "TARGET1ONT2-S9P7",
  "TARGET1ONT3-L4R2", "TARGET1ONT3-M7D5", "TARGET1ONT3-N1F8", "TARGET1ONT3-O9H3", "TARGET1ONT3-P2J6", "TARGET1ONT3-Q5T9", "TARGET1ONT3-R8V1", "TARGET1ONT3-S3X4",
  "DEMO", "ALUNO", "STUDENT", "GUEST", "TEST"
];

export interface LessonInfo {
  id: string;
  unit: number;
  title: string;
  path: string;
}

export const LESSONS: LessonInfo[] = [
  { id: "1A", unit: 1, title: "A - At the airport", path: "/licao1a" },
  { id: "1B", unit: 1, title: "B - Getting a taxi", path: "/licao1b" },
  { id: "1C", unit: 1, title: "C - At the hotel", path: "/licao1c" },
  { id: "1D", unit: 1, title: "D - Unit Challenge", path: "/licao1d" },
  { id: "2A", unit: 2, title: "A - Having Dinner", path: "/licao2a" },
  { id: "2B", unit: 2, title: "B - Fast Food", path: "/licao2b" },
  { id: "2C", unit: 2, title: "C - Grocery Shop", path: "/licao2c" },
  { id: "2D", unit: 2, title: "D - Unit Challenge", path: "/licao2d" },
  { id: "3A", unit: 3, title: "A - Shopping for clothes", path: "/licao3a" },
  { id: "3B", unit: 3, title: "B - Describing clothes", path: "/licao3b" },
  { id: "3C", unit: 3, title: "C - What to wear", path: "/licao3c" },
  { id: "3D", unit: 3, title: "D - Unit Challenge", path: "/licao3d" },
  { id: "4A", unit: 4, title: "A - Taking a Bus", path: "/licao4a" },
  { id: "4B", unit: 4, title: "B - Giving Directions", path: "/licao4b" },
  { id: "4C", unit: 4, title: "C - Getting Lost", path: "/licao4c" },
  { id: "4D", unit: 4, title: "D - Unit Challenge", path: "/licao4d" },
  { id: "5A", unit: 5, title: "A - Job Interview", path: "/licao5a" },
  { id: "5B", unit: 5, title: "B - Company Culture", path: "/licao5b" },
  { id: "5C", unit: 5, title: "C - Onboarding", path: "/licao5c" },
  { id: "5D", unit: 5, title: "D - Unit Challenge", path: "/licao5d" },
  { id: "6A", unit: 6, title: "A - Daily Work Routine", path: "/licao6a" },
  { id: "6B", unit: 6, title: "B - Meeting People", path: "/licao6b" },
  { id: "6C", unit: 6, title: "C - After Work Dinner", path: "/licao6c" },
  { id: "6D", unit: 6, title: "D - Unit Challenge", path: "/licao6d" },
  { id: "7A", unit: 7, title: "A - Renting a Flat", path: "/licao7a" },
  { id: "7B", unit: 7, title: "B - Furnishing", path: "/licao7b" },
  { id: "7C", unit: 7, title: "C - Housewarming Party", path: "/licao7c" },
  { id: "7D", unit: 7, title: "D - Unit Challenge", path: "/licao7d" },
  { id: "8A", unit: 8, title: "A - Vacations and Trips", path: "/licao8a" },
  { id: "8B", unit: 8, title: "B - Timetables", path: "/licao8b" },
  { id: "8C", unit: 8, title: "C - What Comes Next?", path: "/licao8c" },
  { id: "FINALE", unit: 8, title: "🎬 Grand Finale", path: "/encerramento" }
];
