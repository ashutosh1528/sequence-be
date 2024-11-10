import { Request, Response, NextFunction } from "express";
import * as AuthService from "../service/auth";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers?.["authtoken"] || "";
  if (typeof token !== "string") {
    token = token?.[0] || "";
  }
  const { gameId, playerId } = AuthService.verifyToken(token);
  req.authParams = {
    gameId,
    playerId,
  };
  next();
};
