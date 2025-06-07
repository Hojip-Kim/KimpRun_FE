import React from 'react';
import { getInitialTokenNames, getInitialCombinedTokenData } from './server';
import MainPageClient from './components/MainPageClient';

const MainPage = async () => {
  const [initialTokenNames, initialCombinedData] = await Promise.all([
    getInitialTokenNames(),
    getInitialCombinedTokenData(),
  ]);

  return (
    <MainPageClient
      initialTokenNames={initialTokenNames}
      initialCombinedData={initialCombinedData}
    />
  );
};

export default MainPage;
