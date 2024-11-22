import { PlayerDetailsFE } from "../@types/PlayerDetails.interface";
import { GameDetailsFE } from "../@types/GameDetails.interface";
import { InMemoryDataStore } from "../datastore/InMemoryDataStore";
import getGameStatus from "../utils/getGameStatus";
import { TeamDetailsFE } from "src/@types/TeamDetails.interface";

export const createGame = () => {
  const game = InMemoryDataStore.createGame();
  return game.getId();
};

export const addPlayer = (
  gameId: string,
  playerName: string,
  isAdmin = false
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const playerId = game.addPlayer(playerName.trim(), isAdmin);
  return playerId;
};

export const removePlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.removePlayer(playerId);
};

export const setGameRoomId = (gameId: string, roomId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setRoomId(roomId);
};

export const getGameRoomId = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getRoomId();
};

export const setPlayerSocketId = (
  gameId: string,
  playerId: string,
  socketId: string
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setSocketId(socketId);
};

export const getGameDetails = (gameId: string): GameDetailsFE => {
  const game = InMemoryDataStore.getGame(gameId);
  const details = game.getGameDetails();
  const result = {
    gameId: details.id,
    isActive: details.isActive,
    isStarted: details.isStarted,
    isLocked: details.isLocked,
    gameStatus: getGameStatus(
      details.isActive,
      details.isStarted,
      details.isLocked
    ),
    players: {},
    teams: {},
  };
  Object.values(details.players).forEach((player) => {
    const playerDetails = player.getDetails();
    (result.players as Record<string, PlayerDetailsFE>)[playerDetails.id] = {
      ...playerDetails,
    };
  });
  Object.values(details.teams).forEach((team) => {
    const teamDetails = team.getTeam();
    (result.teams as Record<string, TeamDetailsFE>)[teamDetails.id] = {
      ...teamDetails,
    };
  });
  return result;
};

export const getPlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayer(playerId);
};

export const setPlayerReadyStatus = (
  gameId: string,
  playerId: string,
  status: boolean
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setIsReady(status);
};

export const markPlayerOnlineStatus = (
  gameId: string,
  playerId: string,
  status: boolean
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setIsOnline(status);
};

export const lockGame = (gameId: string, status: boolean) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.lockGame(status);
};

export const createTeams = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.createTeams();
  return game.getTeams();
};

export const removeTeams = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.removeTeams();
};

export const assignCards = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const deck = game.getDeck();
  const players = game.getPlayers();
  const allPlayerObj = Object.values(players);
  let i = 0;
  while (i < 5) {
    allPlayerObj.forEach((player) => {
      const card = deck.getCard();
      player.addCard(card);
    });
    i += 1;
  }
};

export const startGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsStart(true);
};

// hack
export const stopGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsStart(false);
};

export const getPlayerCards = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  return player.getCards();
};

export const getBoard = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const board = game.getBoard();
  return board.getBoard();
};
