import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  avatar: "bee",
  loggedIn: false,
  mode: "",
  error: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    changeMode: (state, { payload }: PayloadAction<{ mode: string }>) => ({
      ...state,
      mode: payload.mode,
    }),
    changeName: (state, { payload }: PayloadAction<{ name: string }>) => ({
      ...state,
      name: payload.name,
    }),
    changeAvatar: (state, { payload }: PayloadAction<{ avatar: string }>) => ({
      ...state,
      avatar: payload.avatar,
    }),
    setLogin: (
      state,
      {
        payload,
      }: PayloadAction<{
        name?: string;
        id?: string;
        success: boolean;
        error: string;
      }>
    ) => {
      if (payload.success) {
        return {
          ...state,
          id: payload.id || state.id,
          name: payload.name || state.name,
          loggedIn: true,
          error: "",
        };
      } else {
        return { ...state, loggedIn: false, error: payload.error };
      }
    },
    reset: () => initialState,
  },
});

export const profileReducer = profileSlice.reducer;
export const { changeName, changeMode, setLogin, changeAvatar, reset } =
  profileSlice.actions;
