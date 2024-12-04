import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import os from "os";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(express.json());

// In-memory game storage
const games = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("createGame", ({ gameId, username, settings }) => {
    console.log(`createGame event received from ${socket.id}`);
    console.log(`Game ID: ${gameId}, Host: ${username}, Settings:`, settings);

    const game = {
      id: gameId,
      host: username,
      players: [{ username, points: 0, currentQuestion: 0 }],
      settings,
      questions: generateQuestions(settings),
      status: "waiting",
    };

    games.set(gameId, game);
    socket.join(gameId);
    console.log(`Game ${gameId} created and joined by ${username}`);
    io.to(gameId).emit("gameUpdate", game);
  });

  socket.on("joinGame", ({ gameId, username }) => {
    console.log(`joinGame event received from ${socket.id}`);
    console.log(`Game ID: ${gameId}, Username: ${username}`);

    const game = games.get(gameId);
    if (!game) {
      console.log(`Game ${gameId} not found.`);
      socket.emit("error", "Game not found");
      return;
    }

    if (game.status !== "waiting") {
      console.log(`Game ${gameId} already started.`);
      socket.emit("error", "Game already started");
      return;
    }

    if (game.players.some((p) => p.username === username)) {
      console.log(`Player ${username} is already in game ${gameId}.`);
      socket.emit("error", "Player already in game");
      return;
    }

    game.players.push({ username, points: 0, currentQuestion: 0 });
    socket.join(gameId);
    console.log(`${username} joined game ${gameId}`);
    io.to(gameId).emit("gameUpdate", game);
  });

  socket.on("startGame", ({ gameId }) => {
    console.log(`startGame event received for Game ID: ${gameId}`);

    const game = games.get(gameId);
    if (game) {
      game.status = "playing";
      console.log(`Game ${gameId} has started.`);
      io.to(gameId).emit("gameUpdate", game);
    }
  });

  socket.on("submitAnswer", ({ gameId, username, answer }) => {
    console.log(
      `submitAnswer event received from ${username} for Game ID: ${gameId}`
    );
    console.log(`Answer submitted: ${answer}`);

    const game = games.get(gameId);
    if (!game) {
      console.log(`Game ${gameId} not found.`);
      return;
    }

    const player = game.players.find((p) => p.username === username);
    if (!player) {
      console.log(`Player ${username} not found in Game ${gameId}.`);
      return;
    }

    const question = game.questions[player.currentQuestion];
    console.log(`Expected answer: ${question.answer}`);
    if (answer === question.answer) {
      player.points += 1;
      player.currentQuestion += 1;
      console.log(`${username} answered correctly. Points: ${player.points}`);

      if (player.currentQuestion === game.questions.length) {
        game.status = "finished";
        game.winner = username;
        console.log(`Game ${gameId} finished. Winner: ${username}`);
      }

      io.to(gameId).emit("gameUpdate", game);
    } else {
      console.log(`${username} answered incorrectly.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

function generateQuestions(settings) {
  console.log("Generating questions with settings:", settings);
  const questions = [];
  for (let i = 0; i < settings.questionsCount; i++) {
    const num1 =
      Math.floor(
        Math.random() * (settings.maxNumber - settings.minNumber + 1)
      ) + settings.minNumber;
    const num2 =
      Math.floor(
        Math.random() * (settings.maxNumber - settings.minNumber + 1)
      ) + settings.minNumber;
    questions.push({
      num1,
      num2,
      answer: num1 + num2,
    });
  }
  console.log("Questions generated:", questions);
  return questions;
}

const PORT = process.env.PORT || 10303;

// Get the network IP or hostname
const getNetworkAddress = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

// Start the server and log the accessible URL
httpServer.listen(PORT, () => {
  const host = getNetworkAddress();
  console.log(`Server running on port ${PORT}`);
  console.log(`Accessible at:`);
  console.log(`- Local:    http://localhost:${PORT}`);
  console.log(`- Network:  http://${host}:${PORT}`);
});
