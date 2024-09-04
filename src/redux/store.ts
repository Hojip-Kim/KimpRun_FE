import { configureStore } from '@reduxjs/toolkit';
import tokenReducer from './reducer/tokenReducer';
import infoReducer from './reducer/infoReducer';
import widgetReducer from './reducer/widgetReduce';

const store = configureStore({
  reducer: {
    token: tokenReducer,
    info: infoReducer,
    widget: widgetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
