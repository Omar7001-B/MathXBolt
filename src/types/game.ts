export interface GameSettings {
  minNumber: number;
  maxNumber: number;
  questionsCount: number;
}

export interface Player {
  username: string;
  points: number;
  currentQuestion: number;
}

export interface Game {
  id: string;
  players: Player[];
  settings: GameSettings;
  questions: Question[];
  status: 'waiting' | 'playing' | 'finished';
  winner?: string;
}

export interface Question {
  num1: number;
  num2: number;
  answer: number;
}