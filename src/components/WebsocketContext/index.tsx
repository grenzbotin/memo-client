import React, { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import { WS_ENDPOINT } from "../../configs/ws";
import { useAppDispatch } from "../../store";
import {
  setGameRequest,
  setGameRequestSent,
  setCancelGameRequest,
  setGame,
  updateGame,
  reset as gameReset,
} from "../../store/slices/games";
import {
  addPlayer,
  removePlayer,
  setPlayers,
  updatePlayer,
  reset as playerReset,
} from "../../store/slices/players";
import { setLogin, reset as profileReset } from "../../store/slices/profile";
import { TLogin, TGameOptions, WebsocketContextType } from "./types";

export const WebSocketContext = createContext<WebsocketContextType>({
  ws: null,
  login: () => {},
  getPlayers: () => {},
  requestGame: () => {},
  cancelGameRequest: () => {},
  acceptGameRequest: () => {},
  selectCard: () => {},
  setGameStatusReady: () => {},
});

const WebSocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const dispatch = useAppDispatch();

  const login = (payload: TLogin) => {
    socket?.emit("login", payload);
  };

  const getPlayers = () => {
    socket?.emit("getPlayers");
  };

  const requestGame = (payload: TGameOptions) => {
    socket?.emit("requestGame", payload);
  };

  const cancelGameRequest = (gameId: string) => {
    socket?.emit("cancelGameRequest", gameId);
  };

  const acceptGameRequest = (gameId: string) => {
    socket?.emit("acceptGameRequest", gameId);
  };

  const selectCard = (gameId: string, cardKey: number) => {
    socket?.emit("selectCard", { gameId, cardKey });
  };

  const setGameStatusReady = (gameId: string) => {
    socket?.emit("setGameStatusReady", gameId);
  };

  useEffect(() => {
    if (!socket) {
      const initSocket = io(WS_ENDPOINT);
      setSocket(initSocket);

      // Socket listeners
      // Login
      initSocket.on("loginResponse", (data) => {
        dispatch(setLogin(data));
      });

      // Players
      initSocket.once("getPlayersResponse", (data) => {
        dispatch(setPlayers(data));
      });

      initSocket.on("updatePlayer", (data) => {
        dispatch(updatePlayer(data));
      });

      initSocket.on("newPlayerAdded", (data) => {
        dispatch(addPlayer(data));
      });

      initSocket.on("playerDisconnected", (data) => {
        dispatch(removePlayer(data));
      });

      initSocket.on("gameRequest", (data) => {
        dispatch(setGameRequest(data));
      });

      initSocket.on("gameRequestSent", (data) => {
        dispatch(setGameRequestSent(data));
      });

      initSocket.on("gameRequestCancelled", (data) => {
        dispatch(setCancelGameRequest(data));
      });

      initSocket.on("requestGameResponse", (data) => {
        dispatch(setGameRequestSent(data));
      });

      initSocket.on("gameStarted", (data) => {
        dispatch(setGame(data));
      });

      initSocket.on("updateGame", (data) => {
        dispatch(updateGame(data));
      });

      initSocket.on("opponentLeft", (data) => {
        dispatch(updateGame(data));
      });

      initSocket.on("disconnect", () => {
        // Reset everything
        dispatch(profileReset());
        dispatch(gameReset());
        dispatch(playerReset());
      });
    }

    return () => {
      socket?.disconnect();
    };
  }, [dispatch, socket]);

  return (
    <WebSocketContext.Provider
      value={{
        ws: socket,
        login,
        getPlayers,
        requestGame,
        cancelGameRequest,
        acceptGameRequest,
        selectCard,
        setGameStatusReady,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
