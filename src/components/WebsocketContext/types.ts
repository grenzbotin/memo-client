import { Socket } from "socket.io-client";

export interface TLogin {
  name: string;
  avatar: string;
}

export interface TGameOptions {
  opponentId: string;
  options: {
    fields: number;
    imageCategories: string[];
    timeUntilRelease: number;
  };
}

export interface WebsocketContextType {
  ws: Socket | null;
  login: (payload: TLogin) => void;
  getPlayers: () => void;
  requestGame: (payload: TGameOptions) => void;
  cancelGameRequest: (gameId: string) => void;
  acceptGameRequest: (gameId: string) => void;
  selectCard: (gameId: string, cardKey: number) => void;
  setGameStatusReady: (gameId: string) => void;
}
