import React, { useState } from 'react';
import { GameSettings } from '../types/game';

interface GameLobbyProps {
  username: string;
  onCreateGame: (settings: GameSettings) => void;
  onJoinGame: (gameId: string) => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [gameId, setGameId] = useState('');
  const [settings, setSettings] = useState<GameSettings>({
    minNumber: 1,
    maxNumber: 20,
    questionsCount: 10
  });

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Game Lobby</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create New Game</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={settings.minNumber}
                onChange={(e) => setSettings(s => ({ ...s, minNumber: parseInt(e.target.value) }))}
                className="w-24 px-3 py-2 border rounded-md"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                value={settings.maxNumber}
                onChange={(e) => setSettings(s => ({ ...s, maxNumber: parseInt(e.target.value) }))}
                className="w-24 px-3 py-2 border rounded-md"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions Count</label>
            <input
              type="number"
              value={settings.questionsCount}
              onChange={(e) => setSettings(s => ({ ...s, questionsCount: parseInt(e.target.value) }))}
              className="w-24 px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={() => onCreateGame(settings)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Game
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Join Game</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter Game ID"
          />
          <button
            onClick={() => gameId && onJoinGame(gameId)}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};