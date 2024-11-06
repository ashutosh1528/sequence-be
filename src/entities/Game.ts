import { Deck } from "./Deck";
import { Player } from "./Player";

export class Game {
  private id: string;
  private deck: Deck;
  private players: Record<string, Player>;
  constructor(id: string) {
    this.id = id;
    this.deck = new Deck();
    this.players = {};
  }

  public getGame() {
    return {
      id: this.id,
      deck: this.deck,
      players: this.players,
    };
  }

  public getId() {
    return this.id;
  }

  public getCard() {
    return this.deck.getCard();
  }

  public getDeck() {
    return this.deck.getDeck();
  }

  public addPlayer(name: string) {
    const player = new Player(name);
    this.players[player.getId()] = player;
  }
}
