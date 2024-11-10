import { nanoid } from "nanoid";

export class Player {
  private id: string;
  private name: string;
  private isAdmin: boolean;
  private isOnline: boolean;
  constructor(name: string, isAdmin: boolean) {
    this.id = nanoid();
    this.name = name;
    this.isAdmin = isAdmin;
    this.isOnline = false;
  }

  public getId() {
    return this.id;
  }
}
