import { GAME_STATUS } from "./GameStatus.enum";
import { PlayerDetailsFE } from "./PlayerDetails.interface";
import { TeamDetailsFE } from "./TeamDetails.interface";

export type GameDetailsFE = {
  gameId: string;
  isActive: boolean;
  isStarted: boolean;
  isLocked: boolean;
  players: Record<string, PlayerDetailsFE>;
  gameStatus: GAME_STATUS;
  teams: Record<string, TeamDetailsFE>;
  isCoinPlacedInTurn: boolean;
  isCardPickedInTurn: boolean;
  playerTurnSequence: string[];
  playerTurnIndex: number;
};
