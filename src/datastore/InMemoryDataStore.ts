import { nanoid } from "nanoid";
import { Game } from "../entities/Game";

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
    if (!InMemoryDataStore.instance) throw new Error("No Instance created");
    return true;
  }

  public static createGame() {
    InMemoryDataStore.validateInstance();
    const gameId = nanoid();
    const game = new Game(gameId);
    this.instance.games[gameId] = game;
    return game;
  }

  public static getGame(id: string) {
    InMemoryDataStore.validateInstance();
    return this.instance.games[id] || undefined;
  }

  // update game
  // delete game
}
