import { sign, verify } from "jsonwebtoken";
import { InMemoryDataStore } from "../datastore/InMemoryDataStore";

const PRIVATE_KEY = "ashutosh";

type TokenType = {
  gameId: string;
  playerId: string;
};
export const createToken = (gameId: string, playerId: string) => {
  if (
    !gameId ||
    !playerId ||
    typeof gameId !== "string" ||
    typeof playerId !== "string"
  )
    throw Error("Need valid game ID and player ID to generate token.");
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  if (player) {
    const token = sign({ gameId, playerId }, PRIVATE_KEY);
    return token;
  }
  throw Error("Player is not part of the game.");
};

export const verifyToken = (token: string) => {
  if (!token || typeof token !== "string")
    throw Error("Need valid token to verify it");
  try {
    const { gameId, playerId } =
      (verify(token, PRIVATE_KEY) as TokenType) || {};
    const game = InMemoryDataStore.getGame(gameId);
    const player = game.getPlayer(playerId);
    if (player) {
      return { gameId, playerId };
    }
    throw Error("Player is not part of the game.");
  } catch (e) {
    throw Error("Token is not valid.");
  }
};
