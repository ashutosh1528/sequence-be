import getDeck from "../utils/getDeck";

export class Deck {
  private deck: string[];
  constructor() {
    this.deck = getDeck();
  }

  public getDeck() {
    return this.deck;
  }

  public getCard() {
    const card = this.deck.shift();
    return card || "";
  }

  public resetDeck() {
    this.deck = getDeck();
  }
}
