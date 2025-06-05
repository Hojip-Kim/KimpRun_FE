import { createSlice } from '@reduxjs/toolkit';

const widgetSlices = createSlice({
  name: 'widget',
  initialState: {
    token: '',
    currency: 'KRW',
    interval: '240',
    tokenPrice: 0,
    kimp: 0,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setInterval: (state, action) => {
      state.interval = action.payload;
    },
    setTokenPrice: (state, action) => {
      state.tokenPrice = action.payload;
    },
    setKimp: (state, action) => {
      state.kimp = action.payload;
    },
  },
});

export const { setToken, setCurrency, setInterval, setTokenPrice, setKimp } =
  widgetSlices.actions;
export default widgetSlices.reducer;
