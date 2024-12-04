import React, { useState, useEffect } from 'react';
import { UsernameForm } from './components/UsernameForm';
import { MainMenu } from './components/MainMenu';
import { CreateGame } from './components/CreateGame';
import { JoinGame } from './components/JoinGame';
import { GameBoard } from './components/GameBoard';
import { Game, GameSettings } from './types/game';
import { socket, createGameSocket, joinGameSocket, startGameSocket } from './utils/socket';

type GameScreen = 'username' | 'menu' | 'create' | 'join' | 'play';

function App() {
  const [screen, setScreen] = useState<GameScreen>('username');
  const [username, setUsername] = useState<string>('');
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    socket.on('gameUpdate', (updatedGame: Game) => {
      setGame(updatedGame);
      if (updatedGame.status === 'playing') {
        setScreen('play');
      }
    });

    socket.on('error', (error: string) => {
      console.error('Game error:', error);
      // Handle error appropriately in the UI
    });

    return () => {
      socket.off('gameUpdate');
      socket.off('error');
    };
  }, []);

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setScreen('menu');
  };

  const handleCreateGame = () => {
    const gameId = Math.random().toString(36).substring(7);
    const settings = {
      minNumber: 1,
      maxNumber: 20,
      questionsCount: 10,
    };
    createGameSocket(gameId, username, settings);
    setScreen('create');
  };

  const handleUpdateSettings = (settings: GameSettings) => {
    if (game) {
      createGameSocket(game.id, username, settings);
    }
  };

  const handleStartGame = () => {
    if (game) {
      startGameSocket(game.id);
    }
  };

  const handleJoinGame = (gameId: string) => {
    joinGameSocket(gameId, username);
  };

  const handleAnswer = (answer: number) => {
    if (game) {
      socket.emit('submitAnswer', { gameId: game.id, username, answer });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {screen === 'username' && (
        <UsernameForm onSubmit={handleUsernameSubmit} />
      )}
      {screen === 'menu' && (
        <MainMenu
          onCreateGame={handleCreateGame}
          onJoinGame={() => setScreen('join')}
        />
      )}
      {screen === 'create' && game && (
        <CreateGame
          gameId={game.id}
          players={game.players}
          onUpdateSettings={handleUpdateSettings}
          onStartGame={handleStartGame}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'join' && (
        <JoinGame
          onJoin={handleJoinGame}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'play' && game && (
        <GameBoard
          game={game}
          currentPlayer={username}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

export default App;