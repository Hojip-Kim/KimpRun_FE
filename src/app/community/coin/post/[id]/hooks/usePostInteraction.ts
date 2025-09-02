'use client';

import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { likePost } from '../api/postApi';
import { useGlobalAlert } from '@/providers/AlertProvider';

interface UsePostInteractionProps {
  boardId: number;
  initialLikesCount: number;
}

interface UsePostInteractionReturn {
  likesCount: number;
  isLiking: boolean;
  handleLike: () => Promise<void>;
}

/**
 * 게시글 상호작용(좋아요 등)을 관리하는 커스텀 훅
 */
export function usePostInteraction({
  boardId,
  initialLikesCount,
}: UsePostInteractionProps): UsePostInteractionReturn {
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLiking, setIsLiking] = useState(false);

  // 인증 상태 확인
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  // 전역 알림 훅
  const { showWarning, showSuccess, showError } = useGlobalAlert();

  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      showWarning('공감은 로그인 후 이용하실 수 있습니다.');
      return;
    }

    if (isLiking) {
      return; // 중복 요청 방지
    }

    setIsLiking(true);

    try {
      const result = await likePost(boardId);

      if (result.success) {
        if (result.liked) {
          // 좋아요 성공 - 카운트 증가 및 성공 모달
          setLikesCount((prev) => prev + 1);
          showSuccess(result.message);
        } else {
          // 이미 좋아요를 누른 상태 - 경고 모달
          showWarning(result.message);
        }
      } else {
        // API 호출 실패
        showError(result.message);
      }
    } catch (error) {
      console.error('게시글 좋아요 처리 중 오류:', error);
      showError('공감 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLiking(false);
    }
  }, [boardId, isAuthenticated, isLiking, showWarning, showSuccess, showError]);

  return {
    likesCount,
    isLiking,
    handleLike,
  };
}
