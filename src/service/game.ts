import { PlayerDetailsFE } from "../@types/PlayerDetails.interface";
import { GameDetailsFE } from "../@types/GameDetails.interface";
import { InMemoryDataStore } from "../datastore/InMemoryDataStore";
import getGameStatus from "../utils/getGameStatus";

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
  };
  Object.values(details.players).forEach((player) => {
    const playerDetails = player.getDetails();
    (result.players as Record<string, PlayerDetailsFE>)[playerDetails.id] = {
      ...playerDetails,
    };
  });
  return result;
};

export const getPlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayer(playerId);
};
