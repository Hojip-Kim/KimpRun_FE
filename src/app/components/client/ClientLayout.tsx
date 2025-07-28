'use client';

import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '@/redux/store';
import Nav from '../../../components/nav/Nav';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { LayoutWrapper, MainContent } from './style';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TitleUpdater />
        <LayoutWrapper>
          <Nav />
          <MainContent>{children}</MainContent>
        </LayoutWrapper>
      </PersistGate>
    </Provider>
  );
};

const TitleUpdater = () => {
  const token = useSelector((state: RootState) => state.widget.token);
  const tokenPrice = useSelector((state: RootState) => state.widget.tokenPrice);
  const kimp = useSelector((state: RootState) => state.widget.kimp);
  useEffect(() => {
    document.title = `${token} : ${tokenPrice} ${
      kimp === -100 || kimp === undefined ? '' : `(${kimp?.toFixed(2)})`
    }`;
  }, [token, tokenPrice, kimp]);

  return null;
};

export default ClientLayout;
