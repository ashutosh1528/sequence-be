import { PlayerDetailsFE } from "../@types/PlayerDetails.interface";
import { GameDetailsFE } from "../@types/GameDetails.interface";
import { InMemoryDataStore } from "../datastore/InMemoryDataStore";
import getGameStatus from "../utils/getGameStatus";
import { TeamDetailsFE } from "src/@types/TeamDetails.interface";
import { Cell } from "src/@types/Cell.type";
import getCellIndices from "../utils/getCellIndices";
import isCornerCell from "../utils/isCornerCell";

export const createGame = () => {
  const game = InMemoryDataStore.createGame();
  return game.getId();
};

export const addPlayer = (
  gameId: string,
  playerName: string,
  isAdmin = false
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const playerId = game.addPlayer(playerName.trim(), isAdmin);
  return playerId;
};

export const removePlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.removePlayer(playerId);
};

export const setGameRoomId = (gameId: string, roomId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setRoomId(roomId);
};

export const getGameRoomId = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getRoomId();
};

export const setPlayerSocketId = (
  gameId: string,
  playerId: string,
  socketId: string
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setSocketId(socketId);
};

export const getGameDetails = (gameId: string): GameDetailsFE => {
  const game = InMemoryDataStore.getGame(gameId);
  const details = game.getGameDetails();
  const result = {
    gameId: details.id,
    isActive: details.isActive,
    isStarted: details.isStarted,
    isLocked: details.isLocked,
    isCoinPlacedInTurn: details.isCoinPlacedInTurn,
    isCardPickedInTurn: details.isCardPickedInTurn,
    playerTurnSequence: details.playerTurnSequence,
    playerTurnIndex: details.playerTurnIndex,
    winnerTeamId: details.winnerTeamId,
    gameStatus: getGameStatus(
      details.isActive,
      details.isStarted,
      details.isLocked
    ),
    players: {},
    teams: {},
  };
  Object.values(details.players).forEach((player) => {
    const playerDetails = player.getDetails();
    (result.players as Record<string, PlayerDetailsFE>)[playerDetails.id] = {
      ...playerDetails,
    };
  });
  Object.values(details.teams).forEach((team) => {
    const teamDetails = team.getTeam();
    (result.teams as Record<string, TeamDetailsFE>)[teamDetails.id] = {
      ...teamDetails,
    };
  });
  return result;
};

export const getPlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayer(playerId);
};

export const setPlayerReadyStatus = (
  gameId: string,
  playerId: string,
  status: boolean
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setIsReady(status);
};

export const markPlayerOnlineStatus = (
  gameId: string,
  playerId: string,
  status: boolean
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  player.setIsOnline(status);
};

export const lockGame = (gameId: string, status: boolean) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.lockGame(status);
};

export const createTeams = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.createTeams();
  return game.getTeams();
};

export const removeTeams = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.removeTeams();
};

export const assignCardToPlayer = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const deck = game.getDeck();
  const player = game.getPlayer(playerId);
  const card = deck.getCard();
  player.addCard(card);
};

export const assignCards = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const deck = game.getDeck();
  const players = game.getPlayers();
  const allPlayerObj = Object.values(players);
  let i = 0;
  while (i < 5) {
    allPlayerObj.forEach((player) => {
      const card = deck.getCard();
      player.addCard(card);
    });
    i += 1;
  }
};

export const startGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsStart(true);
};

// hack
export const stopGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsStart(false);
};

export const getPlayerCards = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const player = game.getPlayer(playerId);
  return player.getCards();
};

export const getBoard = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const board = game.getBoard();
  return board;
};

export const getPlayerTurnIndex = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayerTurnIndex();
};

export const getPlayerTurnSequence = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayerTurnSequence();
};

export const getPlayerTeam = (gameId: string, playerId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.getPlayerTeam(playerId);
};

export const setIsCoinPlacedInTurn = (gameId: string, status: boolean) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsCoinPlacedInTurn(status);
};

export const setIsCardPickedInTurn = (gameId: string, status: boolean) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.setIsCardPickedInTurn(status);
};

export const endPlayerTurn = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  return game.setNextPlayerTurnIndex();
};

export const checkIfSequenceMade = (
  gameId: string,
  teamId: string,
  potentialSequence: string[]
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const boardObj = game.getBoard();
  const board = boardObj.getBoard();

  let intersection: Cell | {} = {};
  let foundIntersection = false;
  let shouldContinue = true;
  const isSequenceMade = potentialSequence.every((cellId) => {
    const [x, y] = getCellIndices(cellId);
    const cell = board[x][y];
    if (cell.partOfSequence === 1 && !foundIntersection) {
      foundIntersection = true;
      intersection = { ...cell };
    } else if (cell.partOfSequence === 1 && foundIntersection)
      shouldContinue = false;

    return (
      (cell.teamId === teamId && shouldContinue && cell.partOfSequence < 2) ||
      isCornerCell(cell.id)
    );
  });
  return { isSequenceMade, intersection };
};

export const appendSequence = (
  gameId: string,
  playerId: string,
  sequenceArr: string[],
  intersectionCell: Cell | {}
) => {
  const game = InMemoryDataStore.getGame(gameId);
  const board = game.getBoard();
  const team = game.getPlayerTeam(playerId);
  const sequenceId = team.addSequence(sequenceArr);
  const partOfSequence = Object.keys(intersectionCell).length ? 2 : 1;
  sequenceArr.forEach((cellId) => {
    const [x, y] = getCellIndices(cellId);
    board.markSequence(x, y, partOfSequence, sequenceId);
  });
  if ("sequenceIds" in intersectionCell) {
    const otherSequenceIds = intersectionCell?.sequenceIds.filter(
      (ids) => ids !== sequenceId
    );
    otherSequenceIds.forEach((seqId) => {
      const cellIds = team.getSequence(seqId);
      cellIds.forEach((cellId) => {
        const [x, y] = getCellIndices(cellId);
        board.addPartsOfSequence(x, y);
      });
    });
  }
  return {
    teamId: team.getId(),
    score: team.getScore(),
  };
};

export const findWinnerTeam = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const allTeams = game.getTeams();
  const numberOfTeams = Object.keys(allTeams).length;
  let teamWonId = "";
  Object.values(allTeams).forEach((team) => {
    const teamScore = team.getScore();
    if (numberOfTeams === 2 && teamScore >= 3) teamWonId = team.getId();
    else if (numberOfTeams === 3 && teamScore >= 2) teamWonId = team.getId();
  });
  if (teamWonId) game.setWinnerTeamId(teamWonId);
  return teamWonId;
};

export const endGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  const socketId = game.getRoomId();
  game.clearGame();
  InMemoryDataStore.deleteGame(gameId);
  return socketId;
};

export const resetGame = (gameId: string) => {
  const game = InMemoryDataStore.getGame(gameId);
  game.resetGame();
  const teams = game.getTeams();
  Object.values(teams).forEach((team) => {
    team.reset();
  });
  const players = game.getPlayers();
  Object.values(players).forEach((player) => {
    player.reset();
  });
};
