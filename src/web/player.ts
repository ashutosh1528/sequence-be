import { Request, Router, Response } from "express";
import { Server } from "socket.io";
import * as GameService from "../service/game";
import { authMiddleware } from "../middleware/auth.middleware";
import validateCardFace from "../utils/validateCardFace";
import validateCellId from "../utils/validateCellId";
import { SOCKET_IO } from "../constants";
import getWildCardInfo from "../utils/getWildCardInfo";

const routes = Router();

type ErrorResponse = {
  isSuccess: boolean;
  errorMessage: string;
};

type MoveRequest = {
  cardFace: string;
  cellId: string;
};
routes.patch(
  "/move",
  authMiddleware,
  (req: Request<{}, {}, MoveRequest>, res) => {
    const { gameId = "", playerId = "" } = req?.authParams || {};
    const { cardFace, cellId } = req?.body || {};

    const isCardFaceValid = validateCardFace(cardFace);
    if (!isCardFaceValid) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Card played is missing/invalid.",
      });
      return;
    }

    const isCellIdValid = validateCellId(cellId);
    if (!isCellIdValid) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Coin placement is missing/invalid.",
      });
      return;
    }

    const playerTurnIndex = GameService.getPlayerTurnIndex(gameId);
    const playerTurnSequence = GameService.getPlayerTurnSequence(gameId);
    if (playerTurnSequence[playerTurnIndex] !== playerId) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "It is not your turn.",
      });
      return;
    }

    const board = GameService.getBoard(gameId);
    const idParts = cellId.split(".");
    const [x, y] = [parseInt(idParts[0], 10), parseInt(idParts[1], 10)];
    const boardCell = board.getBoard()[x][y];

    if (boardCell.face === "JJ") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Cannot place the coin in this location.",
      });
      return;
    }

    const wildCardInfo = getWildCardInfo(cardFace);
    const isCellEmpty = !boardCell.teamId;

    if (!wildCardInfo) {
      if (!isCellEmpty) {
        res.status(400).json({
          isSuccess: false,
          errorMessage: "Coin is already placed in this location.",
        });
        return;
      }
      if (boardCell.face !== cardFace) {
        res.status(400).json({
          isSuccess: false,
          errorMessage: "Cannot play this card in this location.",
        });
        return;
      }
    }
    if (wildCardInfo === "PLAY_WILDCARD" && !isCellEmpty) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Coin is already placed in this location.",
      });
      return;
    }
    if (wildCardInfo === "REMOVE_WILDCARD" && isCellEmpty) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Cannot play this card in this location.",
      });
      return;
    }

    // Handle Jacks!
    const playerTeamId =
      GameService.getPlayerTeam(gameId, playerId)?.getTeamId() || "";
    const placedTeamId = board.placeCoin(x, y, playerTeamId, wildCardInfo);

    GameService.setIsCoinPlacedInTurn(gameId, true);

    const socketRoomId = GameService.getGameRoomId(gameId);
    const io: Server = req.app.get(SOCKET_IO);
    io.to(socketRoomId).emit("coinPlaced", {
      cellId,
      teamId: placedTeamId,
      cardFace,
    });

    const player = GameService.getPlayer(gameId, playerId);
    player.removeCard(cardFace);

    res.status(200).json({
      isSuccess: true,
    });
  }
);

routes.patch("/getCard", authMiddleware, (req, res) => {
  const { gameId = "", playerId = "" } = req?.authParams || {};
  const game = GameService.getGameDetails(gameId);
  if (game.isCardPickedInTurn) {
    res.status(400).json({
      isSuccess: false,
      errorMessage: "Card already picked in this turn.",
    });
    return;
  }
  const player = GameService.getPlayer(gameId, playerId);
  const playerCards = player.getCards();
  if (playerCards.length >= 5) {
    res.status(400).json({
      isSuccess: false,
      errorMessage: "You already have 5 cards",
    });
    return;
  }
  GameService.assignCardToPlayer(gameId, playerId);
  GameService.setIsCardPickedInTurn(gameId, true);
  res.status(200).json({
    isSuccess: true,
  });
});

routes.patch("/endTurn", authMiddleware, (req, res) => {
  const { gameId = "", playerId = "" } = req?.authParams || {};
  const game = GameService.getGameDetails(gameId);
  const currentTurnPlayerId = game.playerTurnSequence[game.playerTurnIndex];
  if (playerId !== currentTurnPlayerId) {
    res.status(400).json({
      isSuccess: false,
      errorMessage: "It is not your turn.",
    });
    return;
  }
  const nextTurnIndex = GameService.endPlayerTurn(gameId);
  res.status(200).json({
    isSuccess: true,
  });

  const socketRoomId = GameService.getGameRoomId(gameId);
  const io: Server = req.app.get(SOCKET_IO);
  io.to(socketRoomId).emit("nextTurn", {
    nextTurnIndex: nextTurnIndex,
  });
});

type DiscardCardPayload = {
  cardFace: string;
};
type DiscardCardResponse = {
  isSuccess: boolean;
};
routes.patch(
  "/discardCard",
  authMiddleware,
  (
    req: Request<{}, {}, DiscardCardPayload>,
    res: Response<ErrorResponse | DiscardCardResponse>
  ) => {
    const { gameId = "", playerId = "" } = req?.authParams || {};
    const { cardFace } = req?.body || {};
    if (typeof cardFace !== "string") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Card is missing/invalid.",
      });
    }
    const playerCards = GameService.getPlayerCards(gameId, playerId);
    if (!playerCards.includes(cardFace)) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "You do not have the card you want to discard.",
      });
    }
    const board = GameService.getBoard(gameId);
    const isCardPlayable = board.isCardPlayable(cardFace);
    if (isCardPlayable) {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "This card can still be played as a slot is available.",
      });
    }
    const player = GameService.getPlayer(gameId, playerId);
    player.removeCard(cardFace);
    GameService.assignCardToPlayer(gameId, playerId);
    res.status(200).json({
      isSuccess: true,
    });
  }
);

export default routes;
