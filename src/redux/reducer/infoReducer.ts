import { createSlice } from '@reduxjs/toolkit';

const infoSlices = createSlice({
  name: 'info',
  initialState: { tether: 0, user: 0, dollar: 0 },
  reducers: {
    setTether: (state, action) => {
      state.tether = action.payload;
    },

    setUserCount: (state, action) => {
      state.user = action.payload;
    },
    setDollar: (state, action) => {
      state.dollar = action.payload;
    },
  },
});

export const { setTether, setUserCount, setDollar } = infoSlices.actions;
export default infoSlices.reducer;
