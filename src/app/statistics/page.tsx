import React from 'react';
import { fetchBithumb } from './server/DataFetching';
import StatisticsClient from './client/page';
const StatisticPage = () => {
  const data = fetchBithumb();

  return (
    <div>
      <StatisticsClient />
    </div>
  );
};

export default StatisticPage;
