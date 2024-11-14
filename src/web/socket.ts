import { Server, Socket } from "socket.io";
import * as GameService from "../service/game";

type CreateGameRoomType = {
  data: { gameId: string; playerId: string };
  callbackFn: ({ roomId }: { roomId: string }) => void;
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
    callbackFn(GameService.getSocketRoomData(gameId));
  };

type JoinGameRoomType = {
  data: { gameId: string; playerId: string };
  callbackFn: ({ roomId }: { roomId: string }) => void;
};
export const joinGameRoom =
  (socket: Socket, io: Server) =>
  (
    { gameId, playerId }: JoinGameRoomType["data"],
    callbackFn: JoinGameRoomType["callbackFn"]
  ) => {
    const socketRoomId = GameService.getGameRoomId(gameId);
    socket.join(socketRoomId);
    GameService.setPlayerSocketId(gameId, playerId, socket.id);
    io.to(socketRoomId).emit(
      "playerJoined",
      GameService.getSocketRoomData(gameId)
    );
    callbackFn(GameService.getSocketRoomData(gameId));
  };
