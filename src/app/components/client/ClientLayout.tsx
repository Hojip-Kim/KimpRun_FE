'use client';

import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from '@/redux/store';
import Nav from '../../../components/nav/Nav';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import styled from 'styled-components';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <html lang="en">
          <TitleUpdater />
          <LayoutWrapper>
            <Nav />
            <MainContent>{children}</MainContent>
          </LayoutWrapper>
        </html>
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

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 100px; // Nav의 높이와 동일하게 설정
  min-height: calc(100vh - 150px); // 전체 높이에서 Nav 높이를 뺀 만큼
`;

export default ClientLayout;
