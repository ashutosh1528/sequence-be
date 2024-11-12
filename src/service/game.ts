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

export const getGameDetails = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getGameDetails();
};
