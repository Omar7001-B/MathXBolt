import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);

  // Emit joinGame event
  socket.emit("joinGame", {
    gameId: "testGame123",
    username: "player2",
  });

  // Listen for game updates
  socket.on("gameUpdate", (game) => {
    console.log("Game Update:", game);
  });
});

socket.on("error", (message) => {
  console.log("Error:", message);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
