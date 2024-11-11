import { Request, Response, NextFunction } from "express";
import * as AuthService from "../service/auth";
import { TOKEN_COOKIE } from "../constants";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.[TOKEN_COOKIE] || "";
  const { gameId, playerId } = AuthService.verifyToken(token);
  req.authParams = {
    gameId,
    playerId,
  };
  next();
};
