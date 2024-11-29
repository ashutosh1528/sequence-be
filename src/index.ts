import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import GameRoute from "./web/game";
import PlayerRoute from "./web/player";
import cookieParser from "cookie-parser";
import { InMemoryDataStore } from "./datastore/InMemoryDataStore";
import { SOCKET_IO } from "./constants";
import {
  createGameRoom,
  exitGame,
  joinGameRoom,
  markPlayerOnlineStatus,
  playerRemoved,
} from "./web/socket";

const app = express();
const port = 9000;
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set(SOCKET_IO, io);
io.on("connection", (socket) => {
  socket.on("createGameRoom", createGameRoom(socket));
  socket.on("joinGameRoom", joinGameRoom(socket));
  socket.on("markPlayerOnlineStatus", markPlayerOnlineStatus(socket));
  socket.on("playerRemoved", playerRemoved(socket));
  socket.on("exitGame", exitGame(io));
});
app.use("/game", GameRoute);
app.use("/player", PlayerRoute);

InMemoryDataStore.getInstance();

app.get("/health-check", (req, res) => {
  res.send("Server is Up");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const Room = {
//   id: "room1",
//   deck: ["KH", "KS", "KD"],
//   currentTurn: "player1", // derivated
//   playerSequence: ["player1", "player2"], // derivated
//   teams: {
//     team1: {
//       id: "team1",
//       score: 0,
//       color: "GREEN",
//       players: ["player1"],
//     },
//     team2: {
//       id: "team2",
//       score: 0,
//       color: "RED",
//       players: ["player2"],
//     },
//   }, // derivated
//   players: {
//     player1: {
//       id: "player1",
//       name: "Ashutosh",
//       cards: ["AH", "AS", "AD"],
//       teamId: "team1",
//     },
//     player2: {
//       id: "player2",
//       name: "Rohit",
//       cards: ["KH", "KS", "KD"],
//       teamId: "team2",
//     },
//   },
//   board: [
//     [
//       {
//         id: "0.0",
//         face: "AD",
//         teamId: "",
//       },
//       {
//         id: "0.1",
//         face: "AH",
//         teamId: "team1",
//       },
//     ],
//     [
//       {
//         id: "1.0",
//         face: "AC",
//         teamId: "team2",
//       },
//       {
//         id: "1.1",
//         face: "AH",
//         teamId: "",
//       },
//     ],
//   ],
// };
