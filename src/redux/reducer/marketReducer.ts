import { createSlice } from '@reduxjs/toolkit';
import { MarketState } from '../type';
import { MarketType } from '@/types/marketType';

const initialState: MarketState = {
  selectedMainMarket: MarketType.UPBIT,
  selectedCompareMarket: MarketType.BINANCE,
};

const marketSlice = createSlice({
  name: 'market',
  initialState: initialState,
  reducers: {
    setSelectedMainMarket: (state, action) => {
      state.selectedMainMarket = action.payload;
    },
    setSelectedCompareMarket: (state, action) => {
      state.selectedCompareMarket = action.payload;
    }
  },
});

export const {
  setSelectedMainMarket,
  setSelectedCompareMarket,
} = marketSlice.actions;

export default marketSlice.reducer;
