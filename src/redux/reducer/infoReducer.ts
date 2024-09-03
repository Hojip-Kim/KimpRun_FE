import { createSlice } from '@reduxjs/toolkit';

const infoSlices = createSlice({
  name: 'info',
  initialState: { tether: 0, user: 0 },
  reducers: {
    setTether: (state, action) => {
      state.tether = action.payload;
    },

    setUser: (state, action) => {
      state.user = state.user++;
    },
  },
});

export const { setTether, setUser } = infoSlices.actions;
export default infoSlices.reducer;
