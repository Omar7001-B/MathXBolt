import { Game, GameSettings, Question } from '../types/game';

// In-memory storage for games (in a real app, this would be a database)
const games: { [key: string]: Game } = {};

export const generateQuestions = (settings: GameSettings): Question[] => {
  const questions = [];
  for (let i = 0; i < settings.questionsCount; i++) {
    const num1 = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
    const num2 = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
    questions.push({
      num1,
      num2,
      answer: num1 + num2
    });
  }
  return questions;
};

export const createGame = (hostUsername: string, settings: GameSettings): Game => {
  const game: Game = {
    id: Math.random().toString(36).substring(7),
    players: [{ username: hostUsername, points: 0, currentQuestion: 0 }],
    settings,
    questions: generateQuestions(settings),
    status: 'waiting'
  };
  
  // Store the game in our in-memory storage
  games[game.id] = game;
  return game;
};

export const joinGame = (gameId: string, username: string): Game | null => {
  const game = games[gameId];
  if (!game) {
    console.error('Game not found');
    return null;
  }

  if (game.status !== 'waiting') {
    console.error('Game already started');
    return null;
  }

  if (game.players.some(p => p.username === username)) {
    console.error('Player already in game');
    return null;
  }

  // Add the new player to the game
  game.players.push({
    username,
    points: 0,
    currentQuestion: 0
  });

  return game;
};

export const updateGame = (gameId: string, updatedGame: Game): void => {
  games[gameId] = updatedGame;
};