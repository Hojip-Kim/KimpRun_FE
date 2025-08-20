import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../type';

const getOrCreateGuestName = () => {
  if (typeof window !== 'undefined') {
    let guestName = localStorage.getItem('guestName');
    if (!guestName) {
      const randomNumber = Math.floor(Math.random() * 10000);
      guestName = `익명_${randomNumber}`;
      localStorage.setItem('guestName', guestName);
    }
    return guestName;
  }
  return '익명_0000';
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  uuid: '',
};

const authSlices = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsAuthenticated: (state) => {
      state.isAuthenticated = true;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setGuestUser: (state) => {
      const guestName = getOrCreateGuestName();
      state.isAuthenticated = false;
      state.user = {
        name: guestName,
        email: null,
        role: 'GUEST',
      };
    },
    setUuid: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    logout: (state) => {
      const guestName = getOrCreateGuestName();
      state.isAuthenticated = false;
      state.user = { name: guestName, email: null, role: 'GUEST' };
    },
  },
});

export const { setIsAuthenticated, setUser, logout, setGuestUser, setUuid } =
  authSlices.actions;
export default authSlices.reducer;
