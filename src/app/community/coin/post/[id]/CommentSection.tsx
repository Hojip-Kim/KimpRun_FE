'use client';

import React, { useState, useMemo } from 'react';
import type { Comment } from './types';
import { createComment, formatDate } from './lib/api';
import { FaReply } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useGlobalAlert } from '@/providers/AlertProvider';
import ProfileImage from '@/components/common/ProfileImage';
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

  // Redux에서 인증 상태 가져오기
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { showWarning } = useGlobalAlert();

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
              <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
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
    </CommentSectionContainer>
  );
};

export default CommentSection;
