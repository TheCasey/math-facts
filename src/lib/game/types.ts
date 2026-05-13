export const OPERATIONS = ["add", "subtract", "multiply", "divide"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard", "challenge"] as const;

export type Operation = (typeof OPERATIONS)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type ViewMode = "setup" | "game" | "results" | "stats";

export interface RangeSettings {
  min: number;
  max: number;
}

export interface OperationSettings extends RangeSettings {
  enabled: boolean;
}

export interface GameSettings {
  difficulty: Difficulty;
  operations: Record<Operation, OperationSettings>;
}

export interface StudentProfile {
  id: string;
  name: string;
  createdAt: string;
  lastPlayedAt: string | null;
}

export interface FactStats {
  key: string;
  operation: Operation;
  operandA: number;
  operandB: number;
  displayLabel: string;
  timesSeen: number;
  timesCorrect: number;
  currentStreak: number;
  lastPlayedAt: string;
}

export interface SessionSummary {
  id: string;
  completedAt: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  longestStreak: number;
  elapsedSeconds: number;
  accuracy: number;
}

export interface ProfileState {
  settings: GameSettings;
  bestScore: number;
  factStats: Record<string, FactStats>;
  sessions: SessionSummary[];
}

export interface PersistedAppState {
  profiles: StudentProfile[];
  activeProfileId: string | null;
  profileData: Record<string, ProfileState>;
}

export interface QuestionChoice {
  value: number;
  isCorrect: boolean;
  bubbleX: number;
  bubbleY: number;
  bubbleSize: number;
}

export interface GeneratedQuestion {
  operation: Operation;
  operandA: number;
  operandB: number;
  correctAnswer: number;
  prompt: string;
  factKey: string;
  displayLabel: string;
  choices: QuestionChoice[];
}

export interface FactAttempt {
  key: string;
  operation: Operation;
  operandA: number;
  operandB: number;
  displayLabel: string;
  correct: boolean;
  answeredAt: string;
}

export interface MasteryFactSummary extends FactStats {
  accuracy: number;
  mastered: boolean;
}

export interface OperationInsight {
  operation: Operation;
  accuracy: number;
  highestMasteredRange: number | null;
  recommendedNextRange: RangeSettings;
  masteredFacts: number;
  seenFacts: number;
  strongestFacts: MasteryFactSummary[];
  weakestFacts: MasteryFactSummary[];
}

export interface DifficultyConfig {
  label: string;
  choiceCount: number;
  bubbleDurationMs: number;
  airDrainPerSecond: number;
  description: string;
}

export interface RoundAirRules {
  startingAir: number;
  correctAirGain: number;
  wrongAirPenalty: number;
  missedAirPenalty: number;
}

export const OPERATION_LABELS: Record<Operation, string> = {
  add: "Addition",
  subtract: "Subtraction",
  multiply: "Multiplication",
  divide: "Division"
};

export const OPERATION_SYMBOLS: Record<Operation, string> = {
  add: "+",
  subtract: "-",
  multiply: "x",
  divide: "÷"
};

export const DEFAULT_RANGE_MIN: Record<Operation, number> = {
  add: 1,
  subtract: 1,
  multiply: 1,
  divide: 1
};

export const ABSOLUTE_MIN = 0;
export const ABSOLUTE_MAX = 20;

export const ROUND_AIR_RULES: RoundAirRules = {
  startingAir: 100,
  correctAirGain: 12,
  wrongAirPenalty: 18,
  missedAirPenalty: 10
};

export const ROUND_AIR_DRAIN_INTERVAL_MS = 100;
export const ROUND_NEXT_QUESTION_DELAY_MS = 420;

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    choiceCount: 3,
    bubbleDurationMs: 8400,
    airDrainPerSecond: 2.1,
    description: "Fewer bubbles and more time to think."
  },
  medium: {
    label: "Medium",
    choiceCount: 4,
    bubbleDurationMs: 6500,
    airDrainPerSecond: 2.72,
    description: "A balanced challenge for everyday practice."
  },
  hard: {
    label: "Hard",
    choiceCount: 5,
    bubbleDurationMs: 4700,
    airDrainPerSecond: 5.8,
    description: "Faster bubbles and more choices on screen."
  },
  challenge: {
    label: "Challenge",
    choiceCount: 6,
    bubbleDurationMs: 3600,
    airDrainPerSecond: 7.4,
    description: "Fast, crowded, and built for quick recall."
  }
};
