import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  id: string;
  name: string;
}

const initialState: IUserState = {
  id: "",
  name: ""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
