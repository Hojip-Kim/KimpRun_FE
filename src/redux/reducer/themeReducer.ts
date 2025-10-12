import { createSlice } from '@reduxjs/toolkit';
import { darkPalette, lightPalette } from '@/styles/palette';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
  palette: typeof darkPalette;
}

const initialState: ThemeState = {
  mode: 'dark',
  palette: darkPalette,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      state.palette = state.mode === 'dark' ? darkPalette : lightPalette;
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      state.palette = state.mode === 'dark' ? darkPalette : lightPalette;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
