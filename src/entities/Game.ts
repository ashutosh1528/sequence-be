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
  private isCoinPlacedInTurn: boolean;
  private isCardPickedInTurn: boolean;
  private board: Board;
  private isLocked: boolean;
  private isStarted: boolean;
  private isActive: boolean;
  private winnerTeamId: string;
  private roomId: string;
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
    this.roomId = "";
    this.isActive = true;
    this.isCoinPlacedInTurn = false;
    this.isCardPickedInTurn = false;
    this.winnerTeamId = "";
  }

  public getGameDetails() {
    return {
      id: this.id,
      deck: this.deck,
      players: this.players,
      teams: this.teams,
      playerTurnIndex: this.playerTurnIndex,
      playerTurnSequence: this.playerTurnSequence,
      isLocked: this.isLocked,
      isStarted: this.isStarted,
      roomId: this.roomId,
      isActive: this.isActive,
      isCoinPlacedInTurn: this.isCoinPlacedInTurn,
      isCardPickedInTurn: this.isCardPickedInTurn,
      winnerTeamId: this.winnerTeamId,
    };
  }

  public getId() {
    return this.id;
  }

  public getDeck() {
    return this.deck;
  }

  public getPlayer(playerId: string) {
    const player = this.players[playerId];
    if (player) return player;
    throw Error("Player does not exist in game.");
  }

  public addPlayer(name: string, isAdmin: boolean) {
    if (Object.keys(this.players).length >= 4)
      throw Error("Game is already full.");
    const player = new Player(name, isAdmin);
    this.players[player.getId()] = player;
    return player.getId();
  }

  public removePlayer(playerId: string) {
    const playerToRemove = this.players[playerId];
    if (!playerToRemove) throw Error("Player is not part of the game.");
    delete this.players[playerId];
  }

  public getRoomId() {
    return this.roomId;
  }

  public setRoomId(roomId: string) {
    this.roomId = roomId;
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
      teamObj.getPlayers().forEach((playerId) => {
        this.players[playerId].setTeamId(teamObj.getId());
      });
    });
    this.createPlayerTurnSequence();
  }

  public removeTeams() {
    this.teams = {};
    this.playerTurnSequence = [];
    Object.values(this.players).forEach((player) => {
      player.setTeamId("");
    });
  }

  public getTeams() {
    return this.teams;
  }

  public lockGame(status: boolean) {
    this.isLocked = status;
  }

  public getPlayers() {
    return this.players;
  }

  public setIsStart(status: boolean) {
    this.isStarted = status;
  }

  public getBoard() {
    return this.board;
  }

  public getPlayerTurnIndex() {
    return this.playerTurnIndex;
  }

  public getPlayerTurnSequence() {
    return this.playerTurnSequence;
  }

  public getPlayerTeam(playerId: string) {
    const teams = Object.values(this.teams).filter((team) =>
      team.getPlayers().includes(playerId)
    );
    if (teams.length === 0) {
      throw Error("No team found for the player in the game.");
    }
    return teams[0];
  }

  public setIsCoinPlacedInTurn(status: boolean) {
    this.isCoinPlacedInTurn = status;
  }

  public setIsCardPickedInTurn(status: boolean) {
    this.isCardPickedInTurn = status;
  }

  public setNextPlayerTurnIndex() {
    const currentIndex = this.playerTurnIndex;
    const totalPlayers = this.playerTurnSequence.length;
    this.playerTurnIndex = (currentIndex + 1) % totalPlayers;
    this.isCoinPlacedInTurn = false;
    this.isCardPickedInTurn = false;
    return this.playerTurnIndex;
  }

  public setWinnerTeamId(teamId: string) {
    this.winnerTeamId = teamId;
  }

  public resetGame() {
    this.deck = new Deck();
    this.board = new Board();
    this.winnerTeamId = "";
    this.isCoinPlacedInTurn = false;
    this.isCardPickedInTurn = false;
  }

  public clearGame() {
    this.deck = null as unknown as Deck;
    this.board = null as unknown as Board;
    this.players = null as unknown as Record<string, Player>;
    this.teams = null as unknown as Record<string, Team>;
  }
}
