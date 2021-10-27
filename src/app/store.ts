import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import logger from "redux-logger"

export const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: [logger]
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
