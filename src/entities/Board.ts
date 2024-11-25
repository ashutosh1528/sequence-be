import BOARD from "../constants/BOARD";
import { Cell } from "../@types/Cell.type";

export class Board {
  private gameBoard: Cell[][];
  constructor() {
    this.gameBoard = JSON.parse(JSON.stringify(BOARD));
  }

  public getBoard() {
    return this.gameBoard;
  }

  public placeCoin(
    row: number,
    column: number,
    teamId: string,
    wildCardInfo: "" | "REMOVE_WILDCARD" | "PLAY_WILDCARD"
  ) {
    const placedTeamId = wildCardInfo === "REMOVE_WILDCARD" ? "" : teamId;
    this.gameBoard[row][column].teamId = placedTeamId;
    return placedTeamId;
  }

  public isCardPlayable(cardFace: string) {
    if (cardFace.includes("J")) return true;
    let filledSlots = 0;
    for (const row of this.gameBoard) {
      for (const cell of row) {
        if (cell.face === cardFace && cell.teamId) filledSlots += 1;
        if (filledSlots === 2) return false;
      }
    }
    return true;
  }
}
