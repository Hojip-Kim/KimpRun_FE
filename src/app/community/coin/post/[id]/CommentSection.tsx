import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import type { Comment } from './types';
import { createComment, formatDate } from './lib/api';
import { FaReply } from 'react-icons/fa';

interface CommentSectionProps {
  boardId: number;
  initialComments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  boardId,
  initialComments,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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
    if (content.trim()) {
      const depth = parentId
        ? (comments.find((c) => c.id === parentId)?.depth ?? 0) + 1
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

  const RenderComments = ({ comments }: { comments: Comment[] }) => (
    <>
      {comments.map((comment) => (
        <CommentWrapper key={comment.id}>
          <CommentItem depth={comment.depth}>
            <CommentHeader>
              <CommentAuthor>{comment.nickName}</CommentAuthor>
              <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
            <CommentActions>
              <ReplyButton onClick={() => setReplyingTo(comment.id)}>
                <FaReply /> 답글
              </ReplyButton>
            </CommentActions>
          </CommentItem>
          {replyingTo === comment.id && (
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
              <CommentSubmitButton type="submit">답글 작성</CommentSubmitButton>
            </CommentForm>
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
      <CommentTitle>댓글 {comments.length}개</CommentTitle>
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
      <RenderComments comments={structuredComments} />
    </CommentSectionContainer>
  );
};

export default CommentSection;

const CommentSectionContainer = styled.div`
  margin-top: 2rem;
  font-family: 'Arial', sans-serif;
`;

const CommentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffd700;
`;

const CommentWrapper = styled.div`
  margin-bottom: 1rem;
`;

const CommentItem = styled.div<{ depth: number }>`
  background-color: ${(props) => (props.depth % 2 === 0 ? '#333' : '#2c2c2c')};
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1rem;
  margin-left: ${(props) => props.depth * 1.5}rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  color: #e0e0e0;
`;

const CommentDate = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const CommentContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  color: #e0e0e0;
  margin-bottom: 0.5rem;
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;

  svg {
    margin-right: 0.3rem;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const ChildComments = styled.div`
  margin-top: 1rem;
  margin-left: 1.5rem;
`;

const CommentForm = styled.form`
  margin-bottom: 1.5rem;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  height: 5rem;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 4px;
  resize: vertical;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  background-color: #333;
  color: #e0e0e0;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  }
`;

const CommentSubmitButton = styled.button`
  background-color: #ffd700;
  color: #1e1e1e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ffed4d;
  }
`;
