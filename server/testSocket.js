import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // Emit createGame event
  socket.emit("createGame", {
    gameId: "testGame123",
    username: "testUser",
    settings: { questionsCount: 5, minNumber: 1, maxNumber: 10 },
  });

  // Listen for game updates
  socket.on("gameUpdate", (game) => {
    console.log("Game Update:", game);
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
