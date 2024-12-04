import React from 'react';
import { PlusCircle, Users } from 'lucide-react';

interface MainMenuProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onCreateGame, onJoinGame }) => {
  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Math Battle</h2>
      <div className="space-y-4">
        <button
          onClick={onCreateGame}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          <PlusCircle size={24} />
          Create Game
        </button>
        <button
          onClick={onJoinGame}
          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg"
        >
          <Users size={24} />
          Join Game
        </button>
      </div>
    </div>
  );
};