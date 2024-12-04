import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*" /*[
      "http://localhost:5173", // Local development
      process.env.DEPLOYED_URL, // Deployed URL from env variable
    ]*/,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// In-memory game storage
const games = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("createGame", ({ gameId, username, settings }) => {
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
    io.to(gameId).emit("gameUpdate", game);
  });

  socket.on("joinGame", ({ gameId, username }) => {
    const game = games.get(gameId);
    if (!game) {
      socket.emit("error", "Game not found");
      return;
    }

    if (game.status !== "waiting") {
      socket.emit("error", "Game already started");
      return;
    }

    if (game.players.some((p) => p.username === username)) {
      socket.emit("error", "Player already in game");
      return;
    }

    game.players.push({ username, points: 0, currentQuestion: 0 });
    socket.join(gameId);
    io.to(gameId).emit("gameUpdate", game);
  });

  socket.on("startGame", ({ gameId }) => {
    const game = games.get(gameId);
    if (game) {
      game.status = "playing";
      io.to(gameId).emit("gameUpdate", game);
    }
  });

  socket.on("submitAnswer", ({ gameId, username, answer }) => {
    const game = games.get(gameId);
    if (!game) return;

    const player = game.players.find((p) => p.username === username);
    if (!player) return;

    const question = game.questions[player.currentQuestion];
    if (answer === question.answer) {
      player.points += 1;
      player.currentQuestion += 1;

      if (player.currentQuestion === game.questions.length) {
        game.status = "finished";
        game.winner = username;
      }

      io.to(gameId).emit("gameUpdate", game);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

function generateQuestions(settings) {
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
  return questions;
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
