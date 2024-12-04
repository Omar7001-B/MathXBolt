import React, { useState } from 'react';
import { UsernameForm } from './components/UsernameForm';
import { MainMenu } from './components/MainMenu';
import { CreateGame } from './components/CreateGame';
import { JoinGame } from './components/JoinGame';
import { GameBoard } from './components/GameBoard';
import { Game, GameSettings } from './types/game';
import { createGame } from './utils/gameUtils';

type GameScreen = 'username' | 'menu' | 'create' | 'join' | 'play';

function App() {
  const [screen, setScreen] = useState<GameScreen>('username');
  const [username, setUsername] = useState<string>('');
  const [game, setGame] = useState<Game | null>(null);

  const handleUsernameSubmit = (name: string) => {
    setUsername(name);
    setScreen('menu');
  };

  const handleCreateGame = () => {
    const newGame = createGame(username, {
      minNumber: 1,
      maxNumber: 20,
      questionsCount: 10,
    });
    setGame(newGame);
    setScreen('create');
  };

  const handleUpdateSettings = (settings: GameSettings) => {
    if (game) {
      const updatedGame = {
        ...game,
        settings,
        questions: createGame(username, settings).questions // Regenerate questions with new settings
      };
      setGame(updatedGame);
    }
  };

  const handleStartGame = () => {
    if (game) {
      setGame({ ...game, status: 'playing' });
      setScreen('play');
    }
  };

  const handleJoinGame = (gameId: string) => {
    // In a real app, this would validate the game ID and join an existing game
    console.log('Joining game:', gameId);
    setScreen('play');
  };

  const handleAnswer = (answer: number) => {
    if (!game) return;

    setGame(currentGame => {
      const updatedGame = { ...currentGame };
      const player = updatedGame.players.find(p => p.username === username)!;
      const question = updatedGame.questions[player.currentQuestion];

      if (answer === question.answer) {
        player.points += 1;
        player.currentQuestion += 1;

        if (player.currentQuestion === updatedGame.questions.length) {
          updatedGame.status = 'finished';
          updatedGame.winner = username;
        }
      }

      return updatedGame;
    });
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