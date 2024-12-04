import { io } from 'socket.io-client';

const SOCKET_URL = "https://neko.pylex.xyz:10303/";

console.log('SOCKET_URL', SOCKET_URL);

export const socket = io(SOCKET_URL);

export const createGameSocket = (gameId: string, username: string, settings: any) => {
  socket.emit('createGame', { gameId, username, settings });
};

export const joinGameSocket = (gameId: string, username: string) => {
  socket.emit('joinGame', { gameId, username });
};

export const startGameSocket = (gameId: string) => {
  socket.emit('startGame', { gameId });
};

export const submitAnswerSocket = (gameId: string, username: string, answer: number) => {
  socket.emit('submitAnswer', { gameId, username, answer });
};