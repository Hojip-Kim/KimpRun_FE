import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducer/tokenReducer';
import infoReducer from './reducer/infoReducer';

const store = configureStore({
  reducer: {
    token: tokenReducer,
    info: infoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
