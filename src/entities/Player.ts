import { nanoid } from "nanoid";

export class Player {
  private id: string;
  private name: string;
  private isAdmin: boolean;
  private isOnline: boolean;
  private socketId: string;
  constructor(name: string, isAdmin: boolean) {
    this.id = nanoid();
    this.name = name;
    this.isAdmin = isAdmin;
    this.isOnline = true;
    this.socketId = "";
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
    };
  }

  public setSocketId(socketId: string) {
    this.socketId = socketId;
  }
}
