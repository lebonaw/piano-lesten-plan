export interface DayPlan {
  dayNumber: number;
  title: string;
  timeEstimate: string;
  exercises: string[];
  songs: string[];
  theoryFocus: string;
  practiceRoutine: string[];
}

export interface WeekPlan {
  weekNumber: number;
  theme: string;
  goal: string;
  days: DayPlan[];
}

export interface PianoCourse {
  title: string;
  description: string;
  weeks: WeekPlan[];
  tips: {
    posture: string;
    readingMusic: string;
    handPosition: string;
  };
}

export enum AppState {
  IDLE,
  GENERATING,
  VIEWING,
  ERROR
}