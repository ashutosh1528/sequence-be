import { InMemoryDataStore } from "../datastore/InMemoryDataStore";

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

export const getSocketRoomData = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getSocketDetails();
};

export const getGameDetails = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getGameDetails();
};
