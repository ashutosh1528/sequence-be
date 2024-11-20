import { nanoid } from "nanoid";

export class Team {
  private id: string;
  private players: string[];
  private score: number;
  private color: string;
  constructor(playerArr: string[]) {
    this.id = nanoid();
    this.players = [...playerArr];
    this.score = 0;
    this.color = "";
  }

  public getId() {
    return this.id;
  }

  public getPlayers() {
    return this.players;
  }

  public setColor(color: string) {
    this.color = color;
  }

  public getTeam() {
    return {
      id: this.id,
      players: this.players,
      score: this.score,
      color: this.color,
    };
  }
}
