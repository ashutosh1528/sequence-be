import { GAME_STATUS } from "./GameStatus.enum";
import { PlayerDetailsFE } from "./PlayerDetails.interface";

export type GameDetailsFE = {
  gameId: string;
  isActive: boolean;
  isStarted: boolean;
  isLocked: boolean;
  players: Record<string, PlayerDetailsFE>;
  gameStatus: GAME_STATUS;
};
