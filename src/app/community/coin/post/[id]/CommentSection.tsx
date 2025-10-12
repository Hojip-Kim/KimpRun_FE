'use client';

import React, { useState, useMemo } from 'react';
import type { Comment } from './types';
import { createComment, formatDate, deleteComment } from './lib/api';
import { FaReply, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGlobalAlert } from '@/providers/AlertProvider';
import ProfileImage from '@/components/common/ProfileImage';
import Modal from '@/components/modal/modal';
import {
  CommentSectionContainer,
  CommentTitle,
  CommentWrapper,
  CommentItem,
  CommentHeader,
  CommentAuthor,
  CommentDate,
  CommentContent,
  CommentActions,
  ReplyButton,
  CommentForm,
  CommentTextarea,
  CommentSubmitButton,
  ChildComments,
  AuthWarning,
  CommentFormWrapper,
  AuthorTag,
} from './style';

interface CommentSectionProps {
  boardId: number;
  initialComments: Comment[];
  postAuthorId: number; // 게시글 작성자의 memberId
}

const CommentSection: React.FC<CommentSectionProps> = ({
  boardId,
  initialComments,
  postAuthorId,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

  // Redux에서 인증 상태와 사용자 정보 가져오기
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { showWarning, showSuccess, showError } = useGlobalAlert();

  const structuredComments = useMemo(() => {
    const commentMap = new Map();
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    commentMap.forEach((comment) => {
      if (comment.parentCommentId === 0) {
        rootComments.push(comment);
      } else {
        const parentComment = commentMap.get(comment.parentCommentId);
        if (parentComment) {
          parentComment.children.push(comment);
        }
      }
    });

    return rootComments;
  }, [comments]);

  const handleCommentSubmit = async (
    content: string,
    parentId: number | null = null
  ) => {
    if (!isAuthenticated) {
      showWarning('댓글 작성은 로그인 후 이용하실 수 있습니다.');
      return;
    }

    if (content.trim()) {
      const depth = parentId
        ? Math.min((comments.find((c) => c.id === parentId)?.depth ?? 0) + 1, 1) // depth 1로 제한
        : 0;
      const createdComment = await createComment(
        boardId,
        content,
        depth,
        parentId || 0
      );
      if (createdComment) {
        setComments((prevComments) => [...prevComments, createdComment]);
        setReplyingTo(null);
      }
    }
  };

  const handleAuthorClick = (memberId?: number) => {
    if (memberId) {
      window.open(`/profile/${memberId}`, '_blank');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!currentUser?.memberId) {
      showWarning('로그인이 필요합니다.');
      return;
    }

    try {
      const success = await deleteComment(commentId);
      if (success) {
        showSuccess('댓글이 삭제되었습니다.');
        // 새로고침을 통해 댓글을 새로 받아옴
        window.location.reload();
      } else {
        showError('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류:', error);
      showError('댓글 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const confirmDelete = (commentId: number) => {
    setDeletingCommentId(commentId);
  };

  const RenderComments = ({ comments }: { comments: Comment[] }) => (
    <>
      {comments.map((comment) => (
        <CommentWrapper key={comment.id}>
          <CommentItem depth={comment.depth}>
            <CommentHeader>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ProfileImage
                  src={comment.profileImageUrl}
                  alt={comment.nickName}
                  size={28}
                  onClick={() => handleAuthorClick(comment.memberId)}
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {comment.memberId === postAuthorId && (
                    <AuthorTag>글작성자</AuthorTag>
                  )}
                  <CommentAuthor
                    onClick={() => handleAuthorClick(comment.memberId)}
                    style={{
                      cursor: comment.memberId ? 'pointer' : 'default',
                      opacity: comment.memberId ? 1 : 0.7,
                    }}
                  >
                    {comment.nickName}
                  </CommentAuthor>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                {/* 자신의 댓글이고 내용이 null이 아닌 경우에만 삭제 버튼 표시 */}
                {isAuthenticated && 
                 currentUser?.memberId === comment.memberId && 
                 comment.content !== null && (
                  <button
                    onClick={() => confirmDelete(comment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#999',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ff4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; }}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </CommentHeader>
            <CommentContent 
              style={{
                color: comment.content === null ? '#999' : 'inherit',
                fontStyle: comment.content === null ? 'italic' : 'normal'
              }}
            >
              {comment.content === null ? '삭제된 댓글입니다.' : comment.content}
            </CommentContent>
            <CommentActions>
              {/* depth 1 이하일 때만 답글 버튼 표시 */}
              {comment.depth < 1 && (
                <ReplyButton
                  onClick={() => {
                    if (!isAuthenticated) {
                      showWarning(
                        '답글 작성은 로그인 후 이용하실 수 있습니다.'
                      );
                      return;
                    }
                    setReplyingTo(comment.id);
                  }}
                >
                  <FaReply /> 답글
                </ReplyButton>
              )}
            </CommentActions>
          </CommentItem>
          {replyingTo === comment.id && isAuthenticated && (
            <CommentFormWrapper>
              <CommentForm
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const content = (
                    form.elements.namedItem('content') as HTMLTextAreaElement
                  ).value;
                  handleCommentSubmit(content, comment.id);
                  form.reset();
                }}
              >
                <CommentTextarea
                  name="content"
                  placeholder="답글을 작성하세요"
                />
                <CommentSubmitButton type="submit">
                  답글 작성
                </CommentSubmitButton>
              </CommentForm>
            </CommentFormWrapper>
          )}
          {comment.children && comment.children.length > 0 && (
            <ChildComments>
              <RenderComments comments={comment.children} />
            </ChildComments>
          )}
        </CommentWrapper>
      ))}
    </>
  );

  return (
    <CommentSectionContainer>
      <CommentTitle>💬 댓글 {comments.length}</CommentTitle>

      {isAuthenticated ? (
        <CommentFormWrapper>
          <CommentForm
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const content = (
                form.elements.namedItem('content') as HTMLTextAreaElement
              ).value;
              handleCommentSubmit(content);
              form.reset();
            }}
          >
            <CommentTextarea name="content" placeholder="댓글을 작성하세요" />
            <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
          </CommentForm>
        </CommentFormWrapper>
      ) : (
        <AuthWarning>
          💡 댓글 작성은 로그인 후 이용하실 수 있습니다.
        </AuthWarning>
      )}

      <RenderComments comments={structuredComments} />

      {/* 삭제 확인 모달 */}
      {deletingCommentId && (
        <Modal
          width={400}
          height={200}
          element={
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <h3 style={{ margin: 0, color: '#333' }}>댓글 삭제</h3>
              <p style={{ margin: 0, color: '#666' }}>
                댓글을 삭제하시겠습니까?<br/>
                삭제된 댓글은 복구할 수 없습니다.
              </p>
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                <button
                  onClick={() => setDeletingCommentId(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  onClick={() => handleDeleteComment(deletingCommentId)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#ff4444',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          }
          setModal={() => setDeletingCommentId(null)}
        />
      )}
    </CommentSectionContainer>
  );
};

export default CommentSection;
