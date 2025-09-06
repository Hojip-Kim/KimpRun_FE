'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { BoardData } from './types';
import { formatDate } from './lib/api';
import {
  FaHeart,
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import ProfileImage from '@/components/common/ProfileImage';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { RootState } from '@/redux/store';
import {
  useLikePost,
  useUpdatePost,
  useDeletePost,
} from './hooks/useBoardData';

const ReactQuillComponent = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  { ssr: false }
);

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import {
  Title,
  MetaInfo,
  AuthorInfo,
  AuthorAvatar,
  AuthorName,
  PostDate,
  StatsContainer,
  Stat,
  LikeButton,
  Content,
  PostStatsBar,
  StatItem,
  LikeButtonProminent,
  PostHeader,
  PostTitleContainer,
  AuthorActions,
  ActionButton,
  ActionsDropdown,
  ActionItem,
  EditTitleInput,
  EditActionButtons,
  SaveButton,
  CancelButton,
  EditContentContainer,
} from './style';

const PostContent: React.FC<{
  boardData: BoardData;
  onPostUpdate?: (title: string, content: string) => void;
}> = ({ boardData, onPostUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(boardData.title);
  const [currentContent, setCurrentContent] = useState(boardData.content);
  const [editTitle, setEditTitle] = useState(boardData.title);
  const [editContent, setEditContent] = useState(boardData.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { showConfirm, showSuccess, showError } = useGlobalAlert();
  const actionsRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // React Query 훅들 사용
  const likeMutation = useLikePost(boardData.boardId.toString());
  const updateMutation = useUpdatePost(boardData.boardId.toString());
  const deleteMutation = useDeletePost(boardData.boardId.toString());

  // 작성자인지 확인
  const isAuthor =
    isAuthenticated && currentUser?.memberId === boardData.memberId;

  const handleAuthorClick = () => {
    window.open(`/profile/${boardData.memberId}`, '_blank');
  };

  const handleEditStart = () => {
    setEditTitle(currentTitle);
    setEditContent(currentContent);
    setIsEditing(true);
    setShowActions(false);
  };

  const handleEditCancel = () => {
    setEditTitle(currentTitle);
    setEditContent(currentContent);
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      showError('제목을 입력해주세요.');
      return;
    }

    if (!editContent.trim()) {
      showError('내용을 입력해주세요.');
      return;
    }

    try {
      const result = await updateMutation.mutateAsync({
        title: editTitle.trim(),
        content: editContent.trim(),
      });

      if (result.success) {
        setCurrentTitle(editTitle.trim());
        setCurrentContent(editContent.trim());
        setIsEditing(false);
        showSuccess(result.message);

        if (onPostUpdate) {
          onPostUpdate(editTitle.trim(), editContent.trim());
        }
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      showError('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteClick = () => {
    showConfirm(
      '정말 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.',
      async () => {
        try {
          const result = await deleteMutation.mutateAsync();
          if (result.success) {
            showSuccess(result.message);
            // 게시글 목록으로 이동
            router.push('/community/coin');
          } else {
            showError(result.message);
          }
        } catch (error) {
          console.error('게시글 삭제 오류:', error);
          showError('게시글 삭제 중 오류가 발생했습니다.');
        }
      }
    );
  };

  // 좋아요 핸들러
  const handleLike = async () => {
    if (!isAuthenticated) {
      showError('공감은 로그인 후 이용하실 수 있습니다.');
      return;
    }

    try {
      const result = await likeMutation.mutateAsync();

      if (result.success) {
        if (result.liked) {
          showSuccess(result.message);
        } else {
          showError(result.message);
        }
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('좋아요 처리 오류:', error);
      showError('공감 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <PostTitleContainer>
        {isEditing ? (
          <>
            <EditTitleInput
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            {isAuthor && (
              <EditActionButtons>
                <SaveButton
                  onClick={handleEditSave}
                  disabled={updateMutation.isPending}
                >
                  <FaCheck /> {updateMutation.isPending ? '저장 중...' : '저장'}
                </SaveButton>
                <CancelButton onClick={handleEditCancel}>
                  <FaTimes /> 취소
                </CancelButton>
              </EditActionButtons>
            )}
          </>
        ) : (
          <Title>{currentTitle}</Title>
        )}
      </PostTitleContainer>

      <PostHeader>
        <AuthorInfo>
          <ProfileImage
            src={boardData.profileImageUrl}
            alt={boardData.memberNickName}
            size={40}
            onClick={handleAuthorClick}
          />
          <div>
            <AuthorName onClick={handleAuthorClick}>
              {boardData.memberNickName}
            </AuthorName>
            <PostDate>{formatDate(boardData.createdAt)}</PostDate>
          </div>
          {isAuthor && !isEditing && (
            <AuthorActions ref={actionsRef}>
              <ActionButton onClick={() => setShowActions(!showActions)}>
                <FaEllipsisV />
              </ActionButton>
              {showActions && (
                <ActionsDropdown>
                  <ActionItem onClick={handleEditStart}>
                    <FaEdit /> 수정
                  </ActionItem>
                  <ActionItem
                    className="delete"
                    onClick={() => {
                      handleDeleteClick();
                      setShowActions(false);
                    }}
                  >
                    <FaTrash /> 삭제
                  </ActionItem>
                </ActionsDropdown>
              )}
            </AuthorActions>
          )}
        </AuthorInfo>

        <PostStatsBar>
          <StatItem>
            공감 <strong>{boardData.boardLikesCount}</strong>
          </StatItem>
          <StatItem>
            댓글 <strong>{boardData.commentsCount}</strong>
          </StatItem>
          <StatItem>
            조회 <strong>{boardData.boardViewsCount.toLocaleString()}</strong>
          </StatItem>
        </PostStatsBar>
      </PostHeader>

      {isEditing ? (
        <EditContentContainer>
          <ReactQuillComponent
            forwardedRef={quillRef}
            value={editContent}
            onChange={setEditContent}
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={[
              'header',
              'bold',
              'italic',
              'underline',
              'strike',
              'list',
              'bullet',
              'blockquote',
              'code-block',
              'link',
              'image',
            ]}
            theme="snow"
          />
        </EditContentContainer>
      ) : (
        <Content 
          className="ql-editor" 
          dangerouslySetInnerHTML={{ __html: currentContent }} 
        />
      )}

      {/* 김프가 스타일 좋아요 버튼 */}
      {!isEditing && (
        <LikeButtonProminent
          onClick={handleLike}
          disabled={likeMutation.isPending}
          style={{
            opacity: likeMutation.isPending ? 0.7 : 1,
            cursor: likeMutation.isPending ? 'not-allowed' : 'pointer',
          }}
        >
          <FaHeart />{' '}
          {likeMutation.isPending
            ? '처리중...'
            : `공감 ${boardData.boardLikesCount}`}
        </LikeButtonProminent>
      )}
    </>
  );
};

export default PostContent;
