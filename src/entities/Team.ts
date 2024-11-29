import { nanoid } from "nanoid";

export class Team {
  private id: string;
  private players: string[];
  private score: number;
  private color: string;
  private sequence: Record<string, string[]>;
  constructor(playerArr: string[]) {
    this.id = nanoid();
    this.players = [...playerArr];
    this.score = 0;
    this.color = "";
    this.sequence = {};
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
      sequence: this.sequence,
    };
  }

  public getTeamId() {
    return this.id;
  }

  public addSequence(sequenceArr: string[]) {
    const id = nanoid();
    this.sequence[id] = [...sequenceArr];
    this.score += 1;
    return id;
  }

  public getSequence(id: string) {
    return this.sequence?.[id] || [];
  }

  public reset() {
    this.sequence = {};
    this.score = 0;
  }

  public getScore() {
    return this.score;
  }
}
