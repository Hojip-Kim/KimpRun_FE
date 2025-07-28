import { createSlice } from '@reduxjs/toolkit';
import { WidgetState } from '../type';

const initialState: WidgetState = {
  token: '',
  currency: 'KRW',
  interval: '240',
  tokenPrice: 0,
  kimp: 0,
};

const widgetSlices = createSlice({
  name: 'widget',
  initialState: initialState,
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
