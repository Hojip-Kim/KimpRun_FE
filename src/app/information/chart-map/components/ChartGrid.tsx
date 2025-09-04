'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  activateChart,
  deactivateChart,
  updateChartInterval,
  updateChartSymbol,
  updateChartCurrency,
} from '@/redux/reducer/chartMapReducer';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { FaPlus, FaMinus, FaSearchPlus, FaTimes, BiSearch } from '@/components/icons';
import dynamic from 'next/dynamic';
import { ChartMapSkeleton } from '@/components/skeleton/Skeleton';
import CurrencySelect from '@/components/search/CurrencySelect';
import IntervalSelect from '@/components/search/IntervalSelect';

// 차트맵 전용 위젯을 동적 import
const ChartMapWidget = dynamic(() => import('./ChartMapWidget'), {
  ssr: false,
});

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const ChartSlot = styled.div<{ $isActive: boolean }>`
  position: relative;
  background: ${palette.card};
  border: 1px solid ${palette.border};
  border-radius: 12px;
  overflow: hidden;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const EmptySlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${palette.textMuted};
  height: 100%;
`;

const ToggleButton = styled.button<{ $variant: 'add' | 'remove' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  ${({ $variant }) => {
    if ($variant === 'add') {
      return `
        background: ${palette.accent};
        color: ${palette.bgPage};
        
        &:hover {
          background: #e6c200;
          transform: scale(1.05);
        }
      `;
    } else {
      return `
        background: #dc3545;
        color: white;
        
        &:hover {
          background: #dc2626;
          transform: scale(1.05);
        }
      `;
    }
  }}
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${palette.bgContainer};
  border-bottom: 1px solid ${palette.border};
  min-height: 60px;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 8px 12px;
    min-height: 40px;
    gap: 6px;
    flex-wrap: nowrap;
    align-items: center;
  }
`;

const ChartControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;

  @media (max-width: 768px) {
    gap: 4px;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    gap: 3px;
    flex-shrink: 0;
  }
`;

const ControlLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${palette.textMuted};
  min-width: 25px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 78px;
  height: 34px;
  padding: 0 6px;

  border: 1px solid ${palette.border};
  border-radius: 10px;
  background: ${palette.input};
  color: ${palette.textPrimary};
  font-size: 13px;
  font-weight: 600;
  outline: none;

  @media (max-width: 768px) {
    width: 60px;
    height: 28px;
    font-size: 11px;
    padding: 0 4px;
    border-radius: 6px;
  }

  &:focus {
    border-color: ${palette.accent};
  }

  &::placeholder {
    color: ${palette.textMuted};
  }
`;

const SearchButton = styled.button`
  width: 24px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: ${palette.accent};
  color: ${palette.bgPage};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 9px;

  &:hover {
    background: #d4ac00;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

const SmallSelect = styled.div`
  width: 90px;
  font-size: 11px;

  @media (max-width: 768px) {
    width: 70px;
    font-size: 10px;
  }

  & > div {
    min-height: 28px;

    @media (max-width: 768px) {
      min-height: 28px;
    font-size: 11px;
  }
`;

const ChartActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ChartContent = styled.div`
  flex: 1;
  position: relative;
`;

const HeaderButton = styled.button<{ $variant: 'zoom' | 'remove' }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: ${(props) =>
    props.$variant === 'remove' ? '#dc3545' : palette.accent};
  color: ${(props) => (props.$variant === 'remove' ? 'white' : palette.bgPage)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$variant === 'remove' ? '#c82333' : '#d4ac00'};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

// 모달 관련 스타일
const ChartModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalContent = styled.div`
  background: ${palette.card};
  border-radius: 12px;
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  position: relative;
  width: 90vw;
  height: 80vh;
  max-width: 1400px;
  max-height: 900px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95vw;
    height: 85vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${palette.border};
  background: ${palette.input};
`;

const ModalTitle = styled.h3`
  color: ${palette.accent};
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${palette.textMuted};
  color: ${palette.bgPage};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;

  &:hover {
    background: ${palette.textSecondary};
    transform: scale(1.05);
  }
`;

const ModalChartContainer = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  padding: 0;
`;

const ChartGrid: React.FC = () => {
  const dispatch = useDispatch();
  const slots = useSelector((state: RootState) => state.chartMap.slots);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchInputs, setSearchInputs] = useState<{ [key: number]: string }>(
    {}
  );

  // 컴포넌트 마운트 후 스켈레톤 표시 시간
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5초 후 스켈레톤 제거

    return () => clearTimeout(timer);
  }, []);

  // slots 상태 변경 시 로그
  React.useEffect(() => {}, [slots]);

  const handleActivateChart = (slotId: number) => {
    // 기본값으로 차트 활성화 (BTC, USDT, 4시간봉)
    dispatch(
      activateChart({
        id: slotId,
      })
    );
  };

  const handleDeactivateChart = (slotId: number) => {
    dispatch(deactivateChart(slotId));
  };

  const handleZoomChart = (slot: any) => {
    const actualSymbol = `${slot.symbol}${slot.currency}`;
    setSelectedSymbol(actualSymbol);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSymbol('');
  };

  const handleIntervalChange = (slotId: number, newInterval: string) => {
    dispatch(updateChartInterval({ id: slotId, interval: newInterval }));
  };

  const handleSymbolSearch = (slotId: number) => {
    const searchTerm = searchInputs[slotId];
    if (searchTerm && searchTerm.trim()) {
      dispatch(
        updateChartSymbol({ id: slotId, symbol: searchTerm.toUpperCase() })
      );
      // 입력값 초기화
      setSearchInputs((prev) => ({ ...prev, [slotId]: '' }));
    }
  };

  const handleCurrencyChange = (slotId: number, currency: 'KRW' | 'USDT') => {
    dispatch(updateChartCurrency({ id: slotId, currency }));
  };

  const handleSearchInputChange = (slotId: number, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [slotId]: value }));
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent, slotId: number) => {
    if (e.key === 'Enter') {
      handleSymbolSearch(slotId);
    }
  };

  // 로딩 중이면 스켈레톤 표시
  if (isLoading) {
    return <ChartMapSkeleton />;
  }

  return (
    <>
      <GridContainer>
        {slots.map((slot) => (
          <ChartSlot key={slot.id} $isActive={slot.isActive}>
            {slot.isActive ? (
              <ChartContainer>
                <ChartHeader>
                  <ChartControls>
                    <ControlGroup>
                      <ControlLabel>심볼</ControlLabel>
                      <SearchInput
                        type="text"
                        value={searchInputs[slot.id] || ''}
                        onChange={(e) =>
                          handleSearchInputChange(slot.id, e.target.value)
                        }
                        onKeyDown={(e) => handleSearchKeyPress(e, slot.id)}
                        placeholder={slot.symbol}
                      />
                    </ControlGroup>

                    <ControlGroup>
                      <SmallSelect>
                        <CurrencySelect
                          value={slot.currency}
                          onChangeValue={(val) =>
                            handleCurrencyChange(slot.id, val as 'KRW' | 'USDT')
                          }
                          usePortal={true}
                        />
                      </SmallSelect>
                    </ControlGroup>

                    <ControlGroup>
                      <SmallSelect>
                        <IntervalSelect
                          value={slot.interval}
                          onChangeValue={(val) =>
                            handleIntervalChange(slot.id, val)
                          }
                          usePortal={true}
                        />
                      </SmallSelect>
                    </ControlGroup>
                    <SearchButton onClick={() => handleSymbolSearch(slot.id)}>
                      <BiSearch />
                    </SearchButton>
                  </ChartControls>

                  <ChartActions>
                    <HeaderButton
                      $variant="zoom"
                      onClick={() => handleZoomChart(slot)}
                      title="차트 확대"
                    >
                      <FaSearchPlus />
                    </HeaderButton>
                    <HeaderButton
                      $variant="remove"
                      onClick={() => handleDeactivateChart(slot.id)}
                      title="차트 제거"
                    >
                      <FaMinus />
                    </HeaderButton>
                  </ChartActions>
                </ChartHeader>
                <ChartContent>
                  <ChartMapWidget
                    key={`${slot.id}-${slot.symbol}-${slot.currency}-${slot.interval}`}
                    containerId={slot.containerId}
                    symbol={`${slot.symbol}${slot.currency}`}
                    interval={slot.interval}
                    slotId={slot.id}
                    onIntervalChange={handleIntervalChange}
                  />
                </ChartContent>
              </ChartContainer>
            ) : (
              <EmptySlot>
                <ToggleButton
                  $variant="add"
                  onClick={() => handleActivateChart(slot.id)}
                  title="차트 추가"
                >
                  <FaPlus />
                </ToggleButton>
                <span>차트를 추가하세요</span>
              </EmptySlot>
            )}
          </ChartSlot>
        ))}
      </GridContainer>

      {/* 차트 확대 모달 */}
      {modalOpen && selectedSymbol && (
        <ChartModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedSymbol} 차트</ModalTitle>
              <CloseButton onClick={handleCloseModal} title="닫기">
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalChartContainer>
              <ChartMapWidget
                containerId={`modal-chart-${selectedSymbol}`}
                symbol={selectedSymbol}
                interval="240"
              />
            </ModalChartContainer>
          </ModalContent>
        </ChartModal>
      )}
    </>
  );
};

export default ChartGrid;
