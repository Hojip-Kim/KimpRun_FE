import { combineReducers, configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducer/tokenReducer';
import infoReducer from './reducer/infoReducer';
import widgetReducer from './reducer/widgetReduce';
import authReducer, { setGuestUser } from './reducer/authReducer';
import marketReducer from './reducer/marketReducer';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import noticeReducer from './reducer/noticeReducer';
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === 'undefined'
    ? createNoopStorage()
    : createWebStorage('local');

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'widget', 'info', 'token', 'notice', 'market'],
};

export const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
  info: infoReducer,
  widget: widgetReducer,
  notice: noticeReducer,
  market: marketReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

store.dispatch(setGuestUser());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
