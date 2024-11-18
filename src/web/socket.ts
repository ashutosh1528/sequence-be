import { Socket } from "socket.io";
import * as GameService from "../service/game";

type CreateGameRoomType = {
  data: { gameId: string; playerId: string };
  callbackFn: () => void;
};
export const createGameRoom =
  (socket: Socket) =>
  (
    { gameId, playerId }: CreateGameRoomType["data"],
    callbackFn: CreateGameRoomType["callbackFn"]
  ) => {
    const roomId = `room_${gameId}`;
    socket.join(roomId);

    GameService.setGameRoomId(gameId, roomId);
    GameService.setPlayerSocketId(gameId, playerId, socket.id);

    callbackFn();
  };

type JoinGameRoomType = {
  data: { gameId: string; playerId: string };
  callbackFn: () => void;
};
export const joinGameRoom =
  (socket: Socket) =>
  (
    { gameId, playerId }: JoinGameRoomType["data"],
    callbackFn: JoinGameRoomType["callbackFn"]
  ) => {
    const socketRoomId = GameService.getGameRoomId(gameId);
    socket.join(socketRoomId);
    GameService.setPlayerSocketId(gameId, playerId, socket.id);

    const player = GameService.getPlayer(gameId, playerId);
    socket.broadcast
      .to(socketRoomId)
      .emit("playerJoined", { gameId, ...player.getDetails() });

    callbackFn();
  };

type MarkPlayerOnlineStatus = {
  gameId: string;
  playerId: string;
  status: boolean;
};
export const markPlayerOnlineStatus =
  (socket: Socket) =>
  ({ gameId, playerId, status }: MarkPlayerOnlineStatus) => {
    try {
      const socketRoomId = GameService.getGameRoomId(gameId);
      GameService.markPlayerOnlineStatus(gameId, playerId, status);
      if (!status) socket.leave(socketRoomId);
      else socket.join(socketRoomId);
      socket.broadcast
        .to(socketRoomId)
        .emit("playerOnlineStatus", { playerId, status });
    } catch (e) {}
  };
