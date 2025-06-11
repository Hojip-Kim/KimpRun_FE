import React, { useState, useEffect } from 'react';
import { Notice } from '../type';
import { formatNoticeDate } from '@/method/common_method';
import {
  NoticeModal,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  ModalExchangeBadge,
  ModalNoticeTitle,
  ModalActions,
  ModalButton,
  ModalAutoCloseTimer,
  TimerBar,
} from './style';

interface NewNoticeModalProps {
  notice: Notice | null;
  isVisible: boolean;
  onClose: () => void;
  modalIndex?: number;
  autoCloseTime?: number;
}

const NewNoticeModal: React.FC<NewNoticeModalProps> = ({
  notice,
  isVisible,
  onClose,
  modalIndex = 0,
  autoCloseTime = 10,
}) => {
  const [timeLeft, setTimeLeft] = useState(autoCloseTime);
  const [progress, setProgress] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      setIsClosing(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !notice) {
      setTimeLeft(autoCloseTime);
      setProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          handleClose();
          return autoCloseTime;
        }
        return newTime;
      });

      setProgress((prev) => {
        const newProgress = prev - 100 / (autoCloseTime * 10);
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isVisible, notice, autoCloseTime]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 600);
  };

  const handleViewNotice = () => {
    if (notice?.exchangeUrl && notice?.url) {
      window.open(notice.exchangeUrl + notice.url, '_blank');
    } else if (notice?.url) {
      window.open(notice.url, '_blank');
    }
    handleClose();
  };

  if (!notice) return null;

  return (
    <NoticeModal
      isVisible={isVisible && !isClosing}
      isClosing={isClosing}
      style={{
        top: `${20 + modalIndex * 180}px`,
      }}
    >
      <ModalHeader>
        <ModalTitle>새로운 공지사항</ModalTitle>
        <ModalCloseButton onClick={handleClose}>×</ModalCloseButton>
      </ModalHeader>

      <ModalContent>
        <ModalExchangeBadge exchangeType={notice.exchangeType}>
          {notice.exchangeType}
        </ModalExchangeBadge>

        <ModalNoticeTitle>{notice.title}</ModalNoticeTitle>

        <div style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>
          {formatNoticeDate(notice.createdAt)}
        </div>
      </ModalContent>

      <ModalActions>
        <ModalButton variant="secondary" onClick={handleClose}>
          나중에 보기
        </ModalButton>
        <ModalButton variant="primary" onClick={handleViewNotice}>
          지금 확인하기
        </ModalButton>
      </ModalActions>

      <ModalAutoCloseTimer>
        {Math.ceil(timeLeft)}초 후 자동으로 닫힙니다
        <TimerBar progress={progress} />
      </ModalAutoCloseTimer>
    </NoticeModal>
  );
};

export default NewNoticeModal;
