import { Request, Response, Router } from "express";
import * as GameService from "../service/game";
import * as AuthService from "../service/auth";
import { authMiddleware } from "../middleware/auth.middleware";

const routes = Router();

type ErrorResponse = {
  isSuccess: boolean;
  errorMessage: string;
};

type CreateGameRequest = {
  playerName: string;
};
type CreateGameResponseSuccess = {
  isSuccess: boolean;
  gameId: string;
  playerId: string;
  token: string;
};
routes.post(
  "/",
  (
    req: Request<{}, {}, CreateGameRequest>,
    res: Response<CreateGameResponseSuccess | ErrorResponse>
  ) => {
    const { playerName } = req.body || {};

    if (!playerName || typeof playerName !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Player name is missing/invalid.",
      });
      return;
    }

    const gameId = GameService.createGame();
    const playerId = GameService.addPlayer(gameId, playerName, true);
    const token = AuthService.createToken(gameId, playerId);
    res.status(200).json({
      isSuccess: true,
      gameId,
      playerId,
      token,
    });
  }
);

type JoinGameRequest = {
  gameId: string;
  playerName: string;
};
type JoinGameResponseSuccess = {
  isSuccess: boolean;
  playerId: string;
};
routes.patch(
  "/join",
  (
    req: Request<{}, {}, JoinGameRequest>,
    res: Response<JoinGameResponseSuccess | ErrorResponse>
  ) => {
    const { gameId, playerName } = req.body || {};

    if (!gameId || typeof gameId !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Unable to get game, game ID is missing/invalid.",
      });
      return;
    }
    if (!playerName || typeof playerName !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Player name is missing/invalid.",
      });
    }

    const playerId = GameService.addPlayer(gameId, playerName, false);
    res.status(200).json({
      isSuccess: true,
      playerId,
      // token in some cases ?
    });
  }
);

// temp ??
routes.get("/", authMiddleware, (req: Request, res) => {
  const game = GameService.getGameDetails(req.authParams?.gameId || "");
  res.status(200).json({ ...game });
});

export default routes;
