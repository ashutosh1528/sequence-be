import { Request, Response, Router } from "express";
import * as GameService from "../service/game";
import * as AuthService from "../service/auth";
import { authMiddleware } from "../middleware/auth.middleware";
import { SOCKET_IO, TOKEN_COOKIE } from "../constants";
import { PlayerDetailsFE } from "src/@types/PlayerDetails.interface";
import { Server } from "socket.io";

const routes = Router();

type ErrorResponse = {
  isSuccess: boolean;
  errorMessage: string;
};

type CreateGameRequest = {
  playerName: string;
};
interface CreateGameResponseSuccess extends PlayerDetailsFE {
  isSuccess: boolean;
  gameId: string;
}
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
    const player = GameService.getPlayer(gameId, playerId);
    const token = AuthService.createToken(gameId, playerId);
    res
      .cookie(TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        // secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        isSuccess: true,
        gameId,
        ...player.getDetails(),
      });
  }
);

type JoinGameRequest = {
  gameId: string;
  playerName: string;
};
interface JoinGameResponseSuccess extends PlayerDetailsFE {
  isSuccess: boolean;
  gameId: string;
}
routes.put(
  "/join",
  (
    req: Request<{}, {}, JoinGameRequest>,
    res: Response<JoinGameResponseSuccess | ErrorResponse>
  ) => {
    const { gameId, playerName } = req.body || {};
    if (!gameId || typeof gameId !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Game ID is missing/invalid.",
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
    const player = GameService.getPlayer(gameId, playerId);
    const token = AuthService.createToken(gameId, playerId);
    res
      .cookie(TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        // secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        isSuccess: true,
        gameId,
        ...player.getDetails(),
      });
  }
);

routes.get("/", authMiddleware, (req: Request, res) => {
  try {
    GameService.markPlayerOnlineStatus(
      req.authParams?.gameId || "",
      req.authParams?.playerId || "",
      true
    );
    const game = GameService.getGameDetails(req.authParams?.gameId || "");
    res.status(200).json({ ...game, playerId: req.authParams?.playerId || "" });
  } catch (e) {}
});

type MarkReadyStatusType = {
  status: boolean;
};
routes.patch(
  "/ready",
  authMiddleware,
  (req: Request<{}, {}, MarkReadyStatusType>, res) => {
    const socketRoomId = GameService.getGameRoomId(
      req.authParams?.gameId || ""
    );
    GameService.setPlayerReadyStatus(
      req.authParams?.gameId || "",
      req.authParams?.playerId || "",
      req?.body?.status || false
    );
    const io: Server = req.app.get(SOCKET_IO);
    io.to(socketRoomId).emit("playerReadyStatus", {
      playerId: req.authParams?.playerId || "",
      status: req?.body?.status,
    });
    res.status(200).json({ success: true });
  }
);

type KickPlayerRequest = {
  playerId: string;
};
type KickPlayerResponse = {
  isSuccess: boolean;
};
routes.delete(
  "/kick",
  authMiddleware,
  (
    req: Request<{}, {}, KickPlayerRequest>,
    res: Response<KickPlayerResponse | ErrorResponse>
  ) => {
    if (!req?.body?.playerId || typeof req?.body?.playerId !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Player ID is missing/invalid.",
      });
      return;
    }
    const game = GameService.getGameDetails(req?.authParams?.gameId || "");
    const player = game.players[req?.authParams?.playerId || ""];
    if (player.isAdmin) {
      GameService.removePlayer(
        req?.authParams?.gameId || "",
        req?.body?.playerId || ""
      );
      res.status(200).json({
        isSuccess: true,
      });
      return;
    }
    res.status(400).json({
      isSuccess: false,
      errorMessage: "Only admin can kick out a player.",
    });
  }
);

export default routes;
