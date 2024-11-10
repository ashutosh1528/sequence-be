import { Request, Response, Router } from "express";
import * as GameService from "../service/game";

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
    res.status(200).json({
      isSuccess: true,
      gameId,
      playerId,
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
routes.get("/", (req: Request<{}, {}, {}, { gameId: string }>, res) => {
  const game = GameService.getGameDetails(req.query?.gameId || "");
  res.status(200).json({ ...game });
});

export default routes;
