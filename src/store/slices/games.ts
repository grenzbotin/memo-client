import { createSlice } from "@reduxjs/toolkit";

export type TGameRequestPayload = {
  gameId: string;
  invited_by: string;
  invited_by_avatar: string;
  options: {
    fields: number;
  };
};

export type TInviteSendPayload = {
  opponentId: string;
  gameId: string;
  success: string;
  error: string;
};

export type TGamePayload = {
  has_turn: string;
  host: {
    id: string;
    name: string;
    isReady: boolean;
    avatar: string;
    score: number;
  };
  opponent: {
    id: string;
    name: string;
    isReady: boolean;
    avatar: string;
    score: number;
  };
  id: string;
  imageUrls: string[];
  isGameBlocked: boolean;
  memoryPairs: number;
  gameBoard: { key: number; solved: boolean; imgSrc?: string }[];
  status: string;
  winner: string | null;
  opponentLeft?: boolean;
};

const initialState: {
  requests: TGameRequestPayload[];
  inviteSend: TInviteSendPayload | null;
  current: TGamePayload | null;
} = {
  requests: [],
  inviteSend: null,
  current: null,
};

const gameSlice = createSlice({
  name: "games",
  initialState: initialState,
  reducers: {
    setGameRequest: (state, { payload }) => ({
      ...state,
      requests: [...state.requests, payload],
    }),
    setGameRequestSent: (state, { payload }) => ({
      ...state,
      inviteSend: { ...state, ...payload },
    }),
    setCancelGameRequest: (state, { payload }) => ({
      ...state,
      inviteSend:
        state.inviteSend?.gameId === payload.gameId ? null : state.inviteSend,
      requests: state.requests.filter(
        (request) => request.gameId !== payload.gameId
      ),
    }),
    setGame: (state, { payload }) => ({
      ...state,
      requests: [
        ...state.requests.filter((request) => request.gameId !== payload.id),
      ],
      inviteSend: null,
      current: payload,
    }),
    updateGame: (state, { payload }) => ({
      ...state,
      current: { ...state.current, ...payload },
    }),
    resetCurrentGame: (state) => ({
      ...state,
      current: null,
    }),
    reset: () => initialState,
  },
});

export const gamesReducer = gameSlice.reducer;
export const {
  setGameRequest,
  setGameRequestSent,
  setCancelGameRequest,
  setGame,
  updateGame,
  reset,
  resetCurrentGame,
} = gameSlice.actions;
