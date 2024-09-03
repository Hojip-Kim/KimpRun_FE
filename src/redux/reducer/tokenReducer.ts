import { createSlice } from '@reduxjs/toolkit';

const tokenSlices = createSlice({
  name: 'token', // slice 식별 이름
  initialState: {
    tokenList: { first: {}, second: {} },
    tokenSet: { first: {}, second: {} },
  },
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
