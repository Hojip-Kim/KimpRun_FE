import React, { useState, useMemo } from 'react';
import type { Comment } from './types';
import { createComment, formatDate } from './lib/api';
import { FaReply } from 'react-icons/fa';
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
} from './style';

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
              <CommentTextarea name="content" placeholder="답글을 작성하세요" />
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
