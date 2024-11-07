import { createSlice } from '@reduxjs/toolkit';

const widgetSlices = createSlice({
  name: 'widget',
  initialState: { token: '', currency: 'KRW', interval: '240' },
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
  },
});

export const { setToken, setCurrency, setInterval } = widgetSlices.actions;
export default widgetSlices.reducer;
