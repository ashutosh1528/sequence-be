import { nanoid } from "nanoid";
import { Deck } from "./Deck";

export class Player {
  private id: string;
  private name: string;
  private isAdmin: boolean;
  private isOnline: boolean;
  private isReady: boolean;
  private socketId: string;
  private cards: string[];
  constructor(name: string, isAdmin: boolean) {
    this.id = nanoid();
    this.name = name;
    this.isAdmin = isAdmin;
    this.isOnline = true;
    this.socketId = "";
    this.isReady = false;
    this.cards = [];
  }

  public getId() {
    return this.id;
  }

  public getSocketId() {
    return this.socketId;
  }

  public getDetails() {
    return {
      name: this.name,
      id: this.id,
      isAdmin: this.isAdmin,
      isOnline: this.isOnline,
      isReady: this.isReady,
    };
  }

  public setIsReady(status: boolean) {
    this.isReady = status;
  }

  public setIsOnline(status: boolean) {
    this.isOnline = status;
  }

  public setSocketId(socketId: string) {
    this.socketId = socketId;
  }

  public addCard(deck: Deck) {
    const card = deck.getCard();
    this.cards.push(card);
  }
}
