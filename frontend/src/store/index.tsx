import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { codebaseSlice } from "./store.slice.codebase";

const store = configureStore({
  reducer: {
    codebase: codebaseSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
