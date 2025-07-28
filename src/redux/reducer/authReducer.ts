import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../type";

const getOrCreateGuestName = () => {
  if (typeof window !== "undefined") {
    let guestName = localStorage.getItem("guestName");
    if (!guestName) {
      const randomNumber = Math.floor(Math.random() * 10000);
      guestName = `익명_${randomNumber}`;
      localStorage.setItem("guestName", guestName);
    }
    return guestName;
  }
  return "익명_0000";
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlices = createSlice({
  name: "auth",
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
        role: "GUEST",
      };
    },
    logout: (state) => {
      const guestName = getOrCreateGuestName();
      state.isAuthenticated = false;
      state.user = { name: guestName, email: null, role: "GUEST" };
    },
  },
});

export const { setIsAuthenticated, setUser, logout, setGuestUser } =
  authSlices.actions;
export default authSlices.reducer;
