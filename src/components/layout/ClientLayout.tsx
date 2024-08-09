'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import Nav from '@/components/common/Nav';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <Nav />
      <main>{children}</main>
    </Provider>
  );
};

export default ClientLayout;
