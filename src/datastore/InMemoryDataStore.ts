import { Game } from "../entities/Game";
import getGameId from "../utils/getGameId";

export class InMemoryDataStore {
  private static instance: InMemoryDataStore;
  private games: Record<string, Game>;
  constructor() {
    this.games = {};
  }

  public static getInstance(): InMemoryDataStore {
    if (!InMemoryDataStore.instance) {
      InMemoryDataStore.instance = new InMemoryDataStore();
    }
    this.instance = InMemoryDataStore.instance;
    return InMemoryDataStore.instance;
  }

  private static validateInstance() {
    if (!InMemoryDataStore.instance) throw Error("No Instance created");
    return true;
  }

  public static createGame() {
    InMemoryDataStore.validateInstance();
    let gameId: string;
    while (true) {
      gameId = getGameId();
      if (!this.instance.games[gameId]) break;
    }
    const game = new Game(gameId);
    this.instance.games[gameId] = game;
    return game;
  }

  public static getGame(id: string) {
    InMemoryDataStore.validateInstance();
    const game = this.instance.games[id];
    if (game) return game;
    throw Error("Game does not exists");
  }

  // update game
  // delete game
}
