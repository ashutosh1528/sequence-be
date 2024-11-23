import { Request, Response, Router } from "express";
import * as GameService from "../service/game";
import { authMiddleware } from "../middleware/auth.middleware";
import validateCardFace from "../utils/validateCardFace";
import validateCellId from "../utils/validateCellId";
import { SOCKET_IO } from "../constants";
import { Server } from "socket.io";

const routes = Router();

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
    if (boardCell.teamId) {
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

    if (boardCell.face === "JJ") {
      res.status(400).json({
        isSuccess: false,
        errorMessage: "Cannot place the coin in this location.",
      });
      return;
    }

    // Handle Jacks!
    const playerTeamId =
      GameService.getPlayerTeam(gameId, playerId)?.getTeamId() || "";
    board.placeCoin(x, y, playerTeamId);

    GameService.setIsCoinPlacedInTurn(gameId, true);

    const socketRoomId = GameService.getGameRoomId(gameId);
    const io: Server = req.app.get(SOCKET_IO);
    io.to(socketRoomId).emit("coinPlaced", {
      cellId,
      teamId: playerTeamId,
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
  res.status(200).json({
    isSuccess: true,
  });
});

export default routes;
