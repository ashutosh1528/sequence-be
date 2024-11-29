import { Request, Response, NextFunction } from "express";
import * as AuthService from "../service/auth";
import { TOKEN_COOKIE } from "../constants";

// Need to delete cookies if token is not valid, somehow !
// Common 401 handler on UI to move to home page
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
