import { createSlice } from '@reduxjs/toolkit';
import { TokenState } from '../type';

const initialState: TokenState = {
  tokenList: { first: [], second: [] },
  tokenSet: { first: {}, second: {} },
};

const tokenSlices = createSlice({
  name: 'token',
  initialState: initialState,
  reducers: {
    setTokenFirstList: (state, action) => {
      state.tokenList.first = action.payload;
    },
    setTokenSecondList: (state, action) => {
      state.tokenList.second = action.payload;
    },
    setTokenFirstDataset: (state, action) => {
      state.tokenSet.first = action.payload;
    },
    setTokenSecondDataset: (state, action) => {
      state.tokenSet.second = action.payload;
    },
  },
});

export const {
  setTokenFirstList,
  setTokenSecondList,
  setTokenSecondDataset,
  setTokenFirstDataset,
} = tokenSlices.actions;
export default tokenSlices.reducer;
