import { nanoid } from "nanoid";

export class Player {
  private id: string;
  private name: string;
  private isAdmin: boolean;
  private isOnline: boolean;
  constructor(name: string) {
    this.id = nanoid();
    this.name = name;
    this.isAdmin = false;
    this.isOnline = false;
  }

  public getId() {
    return this.id;
  }
}
