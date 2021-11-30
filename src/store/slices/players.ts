import { createSlice } from "@reduxjs/toolkit";

export type TPlayerPayload = {
  id: string;
  name: string;
  avatar: string;
  played: number;
  won: number;
  draw: number;
  is_playing: boolean;
};

const initialState: { players: TPlayerPayload[] } = {
  players: [],
};

const playersSlice = createSlice({
  name: "players",
  initialState: initialState,
  reducers: {
    setPlayers: (state, { payload }) => ({
      ...state,
      players: payload,
    }),
    addPlayer: (state, { payload }) => ({
      ...state,
      players: [...state.players, payload],
    }),
    updatePlayer: (state, { payload }) => ({
      ...state,
      players: [
        ...state.players.map((player) =>
          player.id === payload.id ? { ...player, ...payload } : player
        ),
      ],
    }),
    removePlayer: (state, { payload }) => ({
      ...state,
      players: [...state.players.filter((player) => player.id !== payload.id)],
    }),
    reset: () => initialState,
  },
});

export const playersReducer = playersSlice.reducer;
export const { setPlayers, addPlayer, updatePlayer, removePlayer, reset } =
  playersSlice.actions;
