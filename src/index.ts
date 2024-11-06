import { InMemoryDataStore } from "./datastore/InMemoryDataStore";
import { GameRoom } from "./model/GameRoom";

const Room = {
  id: "room1",
  deck: ["KH", "KS", "KD"],
  currentTurn: "player1",
  playerSequence: ["player1", "player2"],
  teams: {
    team1: {
      id: "team1",
      score: 0,
      color: "GREEN",
      players: ["player1"],
    },
    team2: {
      id: "team2",
      score: 0,
      color: "RED",
      players: ["player2"],
    },
  },
  players: {
    player1: {
      id: "player1",
      name: "Ashutosh",
      cards: ["AH", "AS", "AD"],
      teamId: "team1",
    },
    player2: {
      id: "player2",
      name: "Rohit",
      cards: ["KH", "KS", "KD"],
      teamId: "team2",
    },
  },
  board: [
    [
      {
        id: "0.0",
        face: "AD",
        teamId: "",
      },
      {
        id: "0.1",
        face: "AH",
        teamId: "team1",
      },
    ],
    [
      {
        id: "1.0",
        face: "AC",
        teamId: "team2",
      },
      {
        id: "1.1",
        face: "AH",
        teamId: "",
      },
    ],
  ],
};
InMemoryDataStore.getInstance();
const game1 = InMemoryDataStore.createGame();
console.log(game1.getDeck());
console.log(game1.getCard());
console.log(game1.getCard());
console.log(game1.getCard());
console.log(game1.getCard());
game1.addPlayer("Ashutosh");
console.log(game1.getGame());

// const game2 = InMemoryDataStore.getGame(game1.getId());
// console.log(game2.getDeck());
