import React, { useState } from 'react';

interface JoinGameProps {
  onJoin: (gameId: string) => void;
  onBack: () => void;
}

export const JoinGame: React.FC<JoinGameProps> = ({ onJoin, onBack }) => {
  const [gameId, setGameId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim()) {
      onJoin(gameId.trim());
    }
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Join Game</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Game ID
          </label>
          <input
            type="text"
            id="gameId"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Game ID"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Join Game
        </button>
      </form>
    </div>
  );
};