import express from "express";

declare global {
  namespace Express {
    interface Request {
      authParams?: {
        gameId: string;
        playerId: string;
      };
    }
  }
}
