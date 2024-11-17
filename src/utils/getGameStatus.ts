import { GAME_STATUS } from "../@types/GameStatus.enum";

export default (isActive: boolean, isStarted: boolean, isLocked: boolean) => {
  if (!isActive) return GAME_STATUS.HOME;
  if (isStarted) return GAME_STATUS.GAME;
  if (isLocked) return GAME_STATUS.LOCK;
  if (isActive && !isStarted && !isLocked) return GAME_STATUS.WAITING;
  return GAME_STATUS.HOME;
};
