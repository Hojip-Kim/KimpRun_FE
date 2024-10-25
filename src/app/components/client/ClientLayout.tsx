'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store, { rootReducer } from '@/redux/store';
import Nav from '../../../components/nav/Nav';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import styled from 'styled-components';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const persistor = persistStore(store);

  useEffect(() => {}, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <html lang="en">
          <LayoutWrapper>
            <Nav />
            <MainContent>{children}</MainContent>
          </LayoutWrapper>
        </html>
      </PersistGate>
    </Provider>
  );
};

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 130px; // Nav의 높이와 동일하게 설정
  min-height: calc(100vh - 130px); // 전체 높이에서 Nav 높이를 뺀 만큼
`;

export default ClientLayout;
