import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAppState {
  id: string;
  name: string;
  roomId: string;
  isModalActive: boolean,
}

const initialState: IAppState = {
  id: "",
  name: "",
  roomId: "",
  isModalActive: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{id: string, name: string}>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    setRoom: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    toggleModal: (state, action: PayloadAction<boolean>) => {
      state.isModalActive = action.payload;
    },
  },
});

export const { setUser, setRoom, toggleModal } = appSlice.actions;

export default appSlice.reducer;
