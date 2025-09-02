import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChartSlot {
  id: number;
  isActive: boolean;
  symbol: string;
  containerId: string;
  interval: string;
  currency: 'KRW' | 'USDT';
}

interface ChartMapState {
  slots: ChartSlot[];
}

const initialState: ChartMapState = {
  slots: [
    {
      id: 0,
      isActive: true,
      symbol: 'BTC',
      containerId: 'chart-0',
      interval: '240',
      currency: 'USDT',
    },
    {
      id: 1,
      isActive: true,
      symbol: 'ETH',
      containerId: 'chart-1',
      interval: '240',
      currency: 'USDT',
    },
    {
      id: 2,
      isActive: false,
      symbol: 'BTC',
      containerId: 'chart-2',
      interval: '240',
      currency: 'USDT',
    },
    {
      id: 3,
      isActive: false,
      symbol: 'BTC',
      containerId: 'chart-3',
      interval: '240',
      currency: 'USDT',
    },
    {
      id: 4,
      isActive: false,
      symbol: 'BTC',
      containerId: 'chart-4',
      interval: '240',
      currency: 'USDT',
    },
    {
      id: 5,
      isActive: false,
      symbol: 'BTC',
      containerId: 'chart-5',
      interval: '240',
      currency: 'USDT',
    },
  ],
};

const chartMapSlice = createSlice({
  name: 'chartMap',
  initialState,
  reducers: {
    activateChart: (
      state,
      action: PayloadAction<{ id: number; symbol?: string }>
    ) => {
      const slot = state.slots.find((slot) => slot.id === action.payload.id);
      if (slot) {
        slot.isActive = true;
        slot.symbol = action.payload.symbol || 'BTC'; // 기본 BTC
        slot.interval = '240'; // 새로 활성화되는 차트는 기본 4시간봉
        slot.currency = 'USDT'; // 기본 통화
      }
    },
    deactivateChart: (state, action: PayloadAction<number>) => {
      const slot = state.slots.find((slot) => slot.id === action.payload);
      if (slot) {
        slot.isActive = false;
        slot.symbol = 'BTC'; // 기본 BTC로 리셋
        slot.interval = '240'; // 비활성화 시 기본값으로 리셋
        slot.currency = 'USDT'; // 기본 통화로 리셋
      }
    },
    updateChartSymbol: (
      state,
      action: PayloadAction<{ id: number; symbol: string }>
    ) => {
      const slot = state.slots.find((slot) => slot.id === action.payload.id);
      if (slot && slot.isActive) {
        slot.symbol = action.payload.symbol;
      }
    },
    updateChartInterval: (
      state,
      action: PayloadAction<{ id: number; interval: string }>
    ) => {
      const slot = state.slots.find((slot) => slot.id === action.payload.id);
      if (slot && slot.isActive) {
        console.log(
          `Redux: Updating chart ${action.payload.id} interval from ${slot.interval} to ${action.payload.interval}`
        );
        slot.interval = action.payload.interval;
      } else {
        console.warn(
          `Redux: Could not update interval for slot ${action.payload.id} (slot not found or inactive)`
        );
      }
    },
    updateChartCurrency: (
      state,
      action: PayloadAction<{ id: number; currency: 'KRW' | 'USDT' }>
    ) => {
      const slot = state.slots.find((slot) => slot.id === action.payload.id);
      if (slot && slot.isActive) {
        slot.currency = action.payload.currency;
      }
    },
    resetCharts: (state) => {
      state.slots = initialState.slots;
    },
  },
});

export const {
  activateChart,
  deactivateChart,
  updateChartSymbol,
  updateChartInterval,
  updateChartCurrency,
  resetCharts,
} = chartMapSlice.actions;

export default chartMapSlice.reducer;
