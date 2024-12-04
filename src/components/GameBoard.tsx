import React, { useState } from 'react';
import { Game, Question } from '../types/game';

interface GameBoardProps {
  game: Game;
  currentPlayer: string;
  onAnswer: (answer: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ game, currentPlayer, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const player = game.players.find(p => p.username === currentPlayer)!;
  const opponent = game.players.find(p => p.username !== currentPlayer);
  const isGameFinished = player.currentQuestion >= game.questions.length;
  const currentQuestion: Question | undefined = game.questions[player.currentQuestion];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAnswer = parseInt(answer);
    if (!isNaN(numAnswer)) {
      onAnswer(numAnswer);
      setAnswer('');
    }
  };

  return (
    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between mb-6">
        <div className="text-lg">
          <span className="font-semibold">Your Progress:</span> {player.currentQuestion}/{game.questions.length}
        </div>
        <div className="text-lg">
          <span className="font-semibold">Score:</span> {player.points}
        </div>
      </div>

      {opponent && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">Opponent: {opponent.username}</h3>
          <div>Progress: {opponent.currentQuestion}/{game.questions.length}</div>
          <div>Score: {opponent.points}</div>
        </div>
      )}

      {!isGameFinished && currentQuestion && (
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-4">
            {currentQuestion.num1} + {currentQuestion.num2} = ?
          </div>
          <form onSubmit={handleSubmit} className="flex gap-4 justify-center">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-32 px-4 py-2 text-2xl text-center border rounded-md"
              placeholder="Answer"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {(isGameFinished || game.status === 'finished') && (
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <h3 className="text-xl font-bold">
            {game.winner === currentPlayer ? 'Congratulations! You won!' : 'Game Over!'}
          </h3>
          <p>Winner: {game.winner}</p>
        </div>
      )}
    </div>
  );
};