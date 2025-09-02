'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBell, FaTimes } from 'react-icons/fa';
import { palette } from '@/styles/palette';
import NoticeClientPage from './client/NoticeClientPage';
import { NoticeResponse } from './type';
import { MarketType } from '@/types/marketType';
import { fetchClientNotice } from './api/clientDataFetch';
import { NoticeSkeleton } from '@/components/skeleton/Skeleton';

interface MobileNoticeFabProps {
  initialNoticeData?: NoticeResponse;
}

const MobileNoticeFab: React.FC<MobileNoticeFabProps> = ({
  initialNoticeData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeData, setNoticeData] = useState<NoticeResponse | null>(
    initialNoticeData || null
  );
  const [isLoading, setIsLoading] = useState(false);

  // 기본 데이터 제공
  const defaultNoticeData: NoticeResponse = {
    data: {
      content: [],
      pageable: {
        sort: { empty: true, sorted: false, unsorted: true },
        offset: 0,
        pageSize: 15,
        pageNumber: 0,
        unpaged: false,
        paged: true,
      },
      last: true,
      totalElements: 0,
      totalPages: 0,
      size: 15,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      first: true,
      numberOfElements: 0,
      empty: true,
    },
    absoluteUrl: '',
    marketType: MarketType.ALL,
  };

  // 모달이 열릴 때 데이터 로드
  const handleOpenModal = async () => {
    setIsModalOpen(true);

    if (!noticeData) {
      setIsLoading(true);
      try {
        const response = await fetchClientNotice({
          marketType: MarketType.ALL,
          page: 0,
          size: 15,
        });

        if (response.success && response.data) {
          setNoticeData(response.data);
        } else {
          setNoticeData(defaultNoticeData);
        }
      } catch (error) {
        console.error('Notice 데이터 로드 실패:', error);
        setNoticeData(defaultNoticeData);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentNoticeData = noticeData || defaultNoticeData;

  return (
    <>
      <Fab onClick={handleOpenModal}>
        <FaBell />
      </Fab>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>공지사항</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalContent data-modal-content="notice">
              {isLoading ? (
                <SkeletonContainer>
                  <NoticeSkeleton items={8} />
                </SkeletonContainer>
              ) : (
                <NoticeClientPage
                  initialNoticeData={currentNoticeData}
                  isModal={true}
                />
              )}
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

const Fab = styled.button`
  position: fixed;
  right: 16px; /* viewport 기준 */
  bottom: 204px; /* viewport 기준 - theme fab 위 */
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${palette.card};
  color: ${palette.textPrimary};
  border: 1px solid ${palette.border};
  box-shadow: ${palette.shadow};
  display: none; /* 기본적으로 숨김 */
  align-items: center;
  justify-content: center;
  z-index: 1200;
  transition: all 0.2s ease;
  transform: scale(0.95); /* 레이아웃과 일치하는 크기 */
  transform-origin: center center;

  &:hover {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    display: flex; /* 모바일에서만 표시 */
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  padding: 1rem;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: ${palette.card};
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${palette.border};
  background: ${palette.card};
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: ${palette.textPrimary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${palette.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${palette.textPrimary};
    background: ${palette.bgPage};
  }
`;

const ModalContent = styled.div`
  max-height: calc(80vh - 120px);
  overflow-y: auto;

  /* Notice 컴포넌트 내부 스타일 조정 */
  & > div {
    padding: 0;
    background: transparent;
    box-shadow: none;
    border: none;
    border-radius: 0;
  }
`;

const SkeletonContainer = styled.div`
  padding: 1rem;
`;

export default MobileNoticeFab;
