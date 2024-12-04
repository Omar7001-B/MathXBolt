import React, { useState } from 'react';
import { GameSettings } from '../types/game';
import { Copy } from 'lucide-react';

interface CreateGameProps {
  gameId: string;
  players: { username: string }[];
  onUpdateSettings: (settings: GameSettings) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export const CreateGame: React.FC<CreateGameProps> = ({
  gameId,
  players,
  onUpdateSettings,
  onStartGame,
  onBack,
}) => {
  const [settings, setSettings] = useState<GameSettings>({
    minNumber: 1,
    maxNumber: 20,
    questionsCount: 10,
  });

  const handleSettingsChange = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    onUpdateSettings(updated);
  };

  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
  };

  return (
    <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Create Game</h2>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Game ID:</span>
          <div className="flex items-center gap-2">
            <code className="bg-gray-200 px-3 py-1 rounded">{gameId}</code>
            <button
              onClick={copyGameId}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
              title="Copy Game ID"
            >
              <Copy size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">Share this ID with your friends to let them join!</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Game Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number Range</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={settings.minNumber}
                onChange={(e) => handleSettingsChange({ minNumber: parseInt(e.target.value) })}
                className="w-24 px-3 py-2 border rounded-md"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                value={settings.maxNumber}
                onChange={(e) => handleSettingsChange({ maxNumber: parseInt(e.target.value) })}
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
              onChange={(e) => handleSettingsChange({ questionsCount: parseInt(e.target.value) })}
              className="w-24 px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Players ({players.length})</h3>
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              {player.username} {index === 0 ? '(Host)' : ''}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onStartGame}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-lg"
      >
        Start Game
      </button>
    </div>
  );
};