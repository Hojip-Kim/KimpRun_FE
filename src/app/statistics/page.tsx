import React from 'react';
import { fetchBithumb } from './DataFetching';

const StatisticPage = () => {
  const data = fetchBithumb();

  return <div>{data}</div>;
};

export default StatisticPage;
