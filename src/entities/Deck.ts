import getDeck from "../utils/getDeck";

export class Deck {
  private cardPile: string[];
  constructor() {
    this.cardPile = getDeck();
  }

  public getCardPile() {
    return this.cardPile;
  }

  public getCard() {
    const card = this.cardPile.shift();
    return card || "";
  }

  public resetCardPile() {
    this.cardPile = getDeck();
  }
}
