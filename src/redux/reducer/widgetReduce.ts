import { createSlice } from '@reduxjs/toolkit';

const widgetSlices = createSlice({
  name: 'widget',
  initialState: { token: '' },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = widgetSlices.actions;
export default widgetSlices.reducer;
