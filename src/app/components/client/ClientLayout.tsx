'use client';

import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store, { rootReducer } from '@/redux/store';
import Nav from '../../../components/layout/nav/Nav';
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
          <Nav />
          <BodyContatiner>{children}</BodyContatiner>
        </html>
      </PersistGate>
    </Provider>
  );
};

const BodyContatiner = styled.div`
  margin-top: 100px;
`;

export default ClientLayout;
