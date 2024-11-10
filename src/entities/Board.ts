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
}
