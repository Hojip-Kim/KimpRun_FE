'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { CommentItem } from '../types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  ButtonGroup,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyText,
  StatusBadge,
  CardGrid,
  CardValue,
  FormGroup,
  Label,
  InputForm,
} from './style';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const CommentManagement: React.FC = () => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Search filters
  const [searchBoardId, setSearchBoardId] = useState<string>('');
  const [searchMemberId, setSearchMemberId] = useState<string>('');

  // Statistics
  const [stats, setStats] = useState({
    totalComments: 0,
    repliesCount: 0,
    totalLikes: 0,
  });

  // Fetch comments by board ID
  const fetchCommentsByBoard = async (boardId: number, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get(
        `/comment?boardId=${boardId}&page=${page}`
      );

      if (response.success && response.data) {
        const commentsList = Array.isArray(response.data)
          ? response.data
          : response.data.content || [];

        setComments(commentsList);
        setTotalElements(commentsList.length);
        setTotalPages(1);

        // Calculate statistics
        const repliesCount = commentsList.filter((c: CommentItem) => c.depth > 0).length;
        const totalLikes = commentsList.reduce((sum: number, c: CommentItem) => sum + (c.likes || 0), 0);

        setStats({
          totalComments: commentsList.length,
          repliesCount,
          totalLikes,
        });
      } else {
        showError('댓글 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching comments by board:', error);
      showError('댓글 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments by member ID
  const fetchCommentsByMember = async (memberId: number, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get(
        `/board/member/${memberId}/comments?page=${page}&size=${pageSize}`
      );

      if (response.success && response.data) {
        setComments(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
        setCurrentPage(page);

        // Calculate statistics
        const repliesCount = (response.data.content || []).filter((c: CommentItem) => c.depth > 0).length;
        const totalLikes = (response.data.content || []).reduce((sum: number, c: CommentItem) => sum + (c.likes || 0), 0);

        setStats({
          totalComments: response.data.totalElements || 0,
          repliesCount,
          totalLikes,
        });

        showSuccess(`사용자 ${memberId}의 댓글을 찾았습니다`);
      } else {
        showError('댓글을 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('Error fetching comments by member:', error);
      showError('사용자 댓글 검색에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // Search by board ID
  const handleSearchByBoard = () => {
    if (!searchBoardId || searchBoardId.trim() === '') {
      showWarning('게시물 ID를 입력해주세요');
      return;
    }

    fetchCommentsByBoard(parseInt(searchBoardId), 1);
  };

  // Search by member ID
  const handleSearchByMember = () => {
    if (!searchMemberId || searchMemberId.trim() === '') {
      showWarning('사용자 ID를 입력해주세요');
      return;
    }

    fetchCommentsByMember(parseInt(searchMemberId), 1);
  };

  // Soft delete comment
  const handleSoftDelete = async (commentId: number) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `/comment/${commentId}/soft`
      );

      if (response.success) {
        showSuccess('댓글이 삭제되었습니다');

        // Refresh current view
        if (searchBoardId) {
          fetchCommentsByBoard(parseInt(searchBoardId), 1);
        } else if (searchMemberId) {
          fetchCommentsByMember(parseInt(searchMemberId), currentPage);
        }
      } else {
        showError('댓글 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError('댓글 삭제에 실패했습니다');
    }
  };

  // Format date
  const formatDate = (dateValue: string | number[]) => {
    try {
      const date = typeof dateValue === 'string'
        ? new Date(dateValue)
        : new Date(dateValue[0], dateValue[1] - 1, dateValue[2], dateValue[3] || 0, dateValue[4] || 0, dateValue[5] || 0);

      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return String(dateValue);
    }
  };

  // Get indent for replies
  const getIndent = (depth: number) => {
    return depth * 20;
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1 && searchMemberId) {
      fetchCommentsByMember(parseInt(searchMemberId), currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && searchMemberId) {
      fetchCommentsByMember(parseInt(searchMemberId), currentPage + 1);
    }
  };

  if (isLoading && comments.length === 0) {
    return (
      <LoadingContainer>
        <p>댓글 목록을 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <div>
      {/* Statistics Cards */}
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>💬 전체 댓글</CardTitle>
          </CardHeader>
          <CardValue>{stats.totalComments}</CardValue>
          <CardDescription>검색된 댓글 수</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>↩️ 대댓글</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#3b82f6' }}>{stats.repliesCount}</CardValue>
          <CardDescription>현재 목록 대댓글</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>❤️ 총 좋아요</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#22c55e' }}>{stats.totalLikes}</CardValue>
          <CardDescription>현재 목록 누적 좋아요</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📄 페이지</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#fbbf24' }}>
            {currentPage} / {totalPages || 1}
          </CardValue>
          <CardDescription>현재 페이지 / 전체</CardDescription>
        </Card>
      </CardGrid>

      {/* Search Section */}
      <Card style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>🔍 댓글 검색</CardTitle>
          <CardDescription>
            게시물 ID 또는 사용자 ID로 댓글을 검색하세요
          </CardDescription>
        </CardHeader>

        <FormGroup>
          <Label>게시물 ID로 검색</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <InputForm
              type="number"
              value={searchBoardId}
              onChange={(e) => setSearchBoardId(e.target.value)}
              placeholder="게시물 ID 입력"
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearchByBoard}>검색</Button>
          </div>
        </FormGroup>

        <FormGroup style={{ marginTop: '1rem' }}>
          <Label>사용자 ID로 검색</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <InputForm
              type="number"
              value={searchMemberId}
              onChange={(e) => setSearchMemberId(e.target.value)}
              placeholder="사용자 ID 입력"
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearchByMember}>검색</Button>
          </div>
        </FormGroup>

        <ButtonGroup style={{ marginTop: '1rem' }}>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchBoardId('');
              setSearchMemberId('');
              setComments([]);
              setStats({ totalComments: 0, repliesCount: 0, totalLikes: 0 });
            }}
          >
            🔄 검색 초기화
          </Button>
        </ButtonGroup>
      </Card>

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle>💬 댓글 목록</CardTitle>
          <CardDescription>
            {totalElements > 0
              ? `전체 ${totalElements}개 댓글 중 ${currentPage} / ${totalPages} 페이지`
              : '검색 조건을 선택하여 댓글을 조회하세요'}
          </CardDescription>
        </CardHeader>

        {comments.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>
              {searchBoardId || searchMemberId
                ? '검색된 댓글이 없습니다'
                : '게시물 ID 또는 사용자 ID로 댓글을 검색하세요'}
            </EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>내용</TableHeaderCell>
                  <TableHeaderCell>작성자</TableHeaderCell>
                  <TableHeaderCell>게시물</TableHeaderCell>
                  <TableHeaderCell>좋아요</TableHeaderCell>
                  <TableHeaderCell>타입</TableHeaderCell>
                  <TableHeaderCell>생성일</TableHeaderCell>
                  <TableHeaderCell>작업</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {comments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>{comment.id}</TableCell>
                    <TableCell>
                      <div style={{ paddingLeft: `${getIndent(comment.depth)}px` }}>
                        {comment.depth > 0 && '↳ '}
                        <span
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                          }}
                        >
                          {comment.content || '(삭제된 댓글)'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{comment.nickName || '알 수 없음'}</TableCell>
                    <TableCell>
                      {comment.boardId ? (
                        <div>
                          <div>ID: {comment.boardId}</div>
                          {comment.boardTitle && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: '#888',
                                maxWidth: '150px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {comment.boardTitle}
                            </div>
                          )}
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{comment.likes || 0}</TableCell>
                    <TableCell>
                      {comment.depth === 0 ? (
                        <StatusBadge status="info">댓글</StatusBadge>
                      ) : (
                        <StatusBadge status="success">대댓글</StatusBadge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
                    <TableCell>
                      {comment.content && (
                        <Button
                          variant="danger"
                          onClick={() => handleSoftDelete(comment.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          삭제
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {/* Pagination (only for member search) */}
            {searchMemberId && totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingBottom: '1rem',
                }}
              >
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  variant="secondary"
                >
                  이전
                </Button>
                <span style={{ color: '#888' }}>
                  {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default CommentManagement;
