import { Deck } from "./Deck";
import { Player } from "./Player";
import { Team } from "./Team";
import { Board } from "./Board";
import TEAM_COLORS from "../constants/TEAM_COLORS";

/**
 * 2 players - 2 teams
 * 3 players - 3 teams
 * 4 players - 2 teams
 */
export class Game {
  private id: string;
  private deck: Deck;
  private players: Record<string, Player>;
  private teams: Record<string, Team>;
  private playerTurnIndex: number;
  private playerTurnSequence: string[];
  private board: Board;
  private isLocked: boolean;
  private isStarted: boolean;
  constructor(id: string) {
    this.id = id;
    this.deck = new Deck();
    this.players = {};
    this.teams = {};
    this.playerTurnIndex = 0;
    this.playerTurnSequence = [];
    this.board = new Board();
    this.isLocked = false;
    this.isStarted = false;
  }

  public getGameDetails() {
    return {
      id: this.id,
      deck: this.deck,
      players: this.players,
      teams: this.teams,
      playerTurnIndex: this.playerTurnIndex,
      playerTurnSequence: this.playerTurnSequence,
      board: this.board,
      isLocked: this.isLocked,
      isStarted: this.isStarted,
    };
  }

  public getId() {
    return this.id;
  }

  public getCard() {
    return this.deck.getCard();
  }

  public getDeck() {
    return this.deck.getCardPile();
  }

  public addPlayer(name: string, isAdmin: boolean) {
    if (Object.keys(this.players).length >= 4)
      throw Error("Game is already full.");
    const player = new Player(name, isAdmin);
    this.players[player.getId()] = player;
    return player.getId();
  }

  private getTeamCount() {
    const numberOfPlayers = Object.keys(this.players).length || 0;
    if (numberOfPlayers === 1) return 1;
    if (numberOfPlayers === 2) return 2;
    if (numberOfPlayers === 3) return 3;
    if (numberOfPlayers === 4) return 2;
    return 1;
  }

  private createPlayerTurnSequence() {
    const totalPlayers = Object.keys(this.players).length;
    const teamIds = Object.keys(this.teams);
    const playerPerTeam = totalPlayers / this.getTeamCount();
    const teamWisePlayers: Record<string, string[]> = {};
    teamIds.forEach((teamId) => {
      teamWisePlayers[teamId] = this.teams[teamId].getPlayers();
    });
    let i = 0;
    const result: string[] = [];
    while (i < playerPerTeam) {
      teamIds.forEach((teamId) => {
        result.push(teamWisePlayers[teamId][i]);
      });
      i += 1;
    }
    this.playerTurnSequence = [...result];
  }

  public createTeams() {
    const numberOfTeams = this.getTeamCount();
    const playerIds = Object.keys(this.players);
    const teams: string[][] = [];
    playerIds.forEach((playerId, idx) => {
      const teamIdx = idx % numberOfTeams;
      if (teams[teamIdx]) {
        teams[teamIdx].push(playerId);
      } else {
        teams[teamIdx] = [playerId];
      }
    });
    teams.forEach((team, idx) => {
      const teamObj = new Team(team);
      teamObj.setColor(TEAM_COLORS[idx]);
      this.teams[teamObj.getId()] = teamObj;
    });
    this.createPlayerTurnSequence();
  }
}
