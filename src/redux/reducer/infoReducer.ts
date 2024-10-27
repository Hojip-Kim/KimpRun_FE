import { createSlice } from '@reduxjs/toolkit';

const infoSlices = createSlice({
  name: 'info',
  initialState: { tether: 0, user: 0 },
  reducers: {
    setTether: (state, action) => {
      state.tether = action.payload;
    },

    setUserCount: (state) => {
      state.user = state.user++;
    },
  },
});

export const { setTether, setUserCount } = infoSlices.actions;
export default infoSlices.reducer;
