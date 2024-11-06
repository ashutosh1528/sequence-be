import { nanoid } from "nanoid";

export class Player {
  private id: string;
  private name: string;
  constructor(name: string) {
    this.id = nanoid();
    this.name = name;
  }

  public getId() {
    return this.id;
  }
}
