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
      // 실제 사용자 정보가 있고 GUEST가 아니면 인증된 상태로 설정
      if (action.payload && action.payload.role !== 'GUEST') {
        state.isAuthenticated = true;
      }
    },
    setGuestUser: (state) => {
      const guestName = getOrCreateGuestName();
      state.isAuthenticated = false;
      state.user = {
        name: guestName,
        email: null,
        role: 'GUEST',
        memberId: null,
      };
    },
    setUuid: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload;
    },
    // 로그인 액션 (사용자 정보와 인증 상태를 동시에 설정)
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    logout: (state) => {
      const guestName = getOrCreateGuestName();
      state.isAuthenticated = false;
      state.user = {
        name: guestName,
        email: null,
        role: 'GUEST',
        memberId: null,
      };
    },
  },
});

export const {
  setIsAuthenticated,
  setUser,
  login,
  logout,
  setGuestUser,
  setUuid,
} = authSlices.actions;
export default authSlices.reducer;
