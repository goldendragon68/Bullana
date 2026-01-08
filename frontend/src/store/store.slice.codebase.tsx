import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICodebase {}

const initialState = {} as ICodebase;

export const codebaseSlice = createSlice({
  name: "codebaseSlice",
  initialState,
  reducers: {
    init: (store: ICodebase, action: PayloadAction<ICodebase>) => {
      store = action.payload;
    },
  },
});

// export const selectCount = (state: RootState) => state.user.value;

export const { init: initStoreCodebase } = codebaseSlice.actions;
