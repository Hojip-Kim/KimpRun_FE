'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { BoardItem, BoardPage, Category, BatchHardDeleteRequest, CommunitySubTab } from '../types';
import CommentManagement from './CommentManagement';
import ExpertManagement from './ExpertManagement';
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
  TabNav,
  TabButton,
} from './style';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const BoardManagement: React.FC = () => {
  // Sub-tab state
  const [activeSubTab, setActiveSubTab] = useState<CommunitySubTab>('boards');
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number>(1); // 1 = 전체
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchBoardId, setSearchBoardId] = useState<string>('');
  const [searchMemberId, setSearchMemberId] = useState<string>('');

  // Selection
  const [selectedBoards, setSelectedBoards] = useState<number[]>([]);

  // Batch Delete Modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchDaysAgo, setBatchDaysAgo] = useState<number>(30);
  const [batchPreviewResult, setBatchPreviewResult] = useState<any>(null);

  // Statistics
  const [stats, setStats] = useState({
    totalBoards: 0,
    pinnedBoards: 0,
    totalViews: 0,
    totalLikes: 0,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await clientRequest.get(
        `/category`
      );
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch boards by category
  const fetchBoards = async (page: number = 1, categoryId: number = 1) => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get<BoardPage>(
        `/board/${categoryId}?page=${page}&size=${pageSize}`
      );

      if (response.success && response.data) {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(page);

        // Calculate statistics
        const pinnedCount = response.data.content.filter((b) => b.isPin).length;
        const totalViews = response.data.content.reduce(
          (sum, b) => sum + b.boardViewsCount,
          0
        );
        const totalLikes = response.data.content.reduce(
          (sum, b) => sum + b.boardLikesCount,
          0
        );

        setStats({
          totalBoards: response.data.totalElements,
          pinnedBoards: pinnedCount,
          totalViews,
          totalLikes,
        });
      } else {
        showError('게시물 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      showError('게시물 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // Search board by ID
  const handleSearchBoard = async () => {
    if (!searchBoardId || searchBoardId.trim() === '') {
      showWarning('게시물 ID를 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.get(
        `/board?boardId=${searchBoardId}&commentPage=1`
      );

      if (response.success && response.data) {
        setBoards([response.data]);
        setTotalPages(1);
        setTotalElements(1);
        showSuccess('게시물을 찾았습니다');
      } else {
        showError('게시물을 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('Error searching board:', error);
      showError('게시물 검색에 실패했습니다');
    }
  };

  // Search boards by member ID
  const handleSearchByMember = async () => {
    if (!searchMemberId || searchMemberId.trim() === '') {
      showWarning('사용자 ID를 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.get<BoardPage>(
        `/board/member/${searchMemberId}?page=1&size=${pageSize}`
      );

      if (response.success && response.data) {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        showSuccess(`사용자 ${searchMemberId}의 게시물을 찾았습니다`);
      } else {
        showError('게시물을 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('Error searching by member:', error);
      showError('사용자 게시물 검색에 실패했습니다');
    }
  };

  // Soft delete board
  const handleSoftDelete = async (boardId: number) => {
    if (!confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `/board/${boardId}/soft`
      );

      if (response.success) {
        showSuccess('게시물이 삭제되었습니다');
        fetchBoards(currentPage, selectedCategory);
      } else {
        showError('게시물 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      showError('게시물 삭제에 실패했습니다');
    }
  };

  // Toggle board pin
  const handleTogglePin = async (boardId: number, currentPinStatus: boolean) => {
    const action = currentPinStatus ? '고정 해제' : '고정';
    if (!confirm(`이 게시물을 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      const endpoint = currentPinStatus
        ? `/board/deActivate`
        : `/board/activate`;

      const response = await clientRequest.patch(endpoint, {
        boardIds: [boardId],
      });

      if (response.success) {
        showSuccess(`게시물이 ${action}되었습니다`);
        fetchBoards(currentPage, selectedCategory);
      } else {
        showError(`게시물 ${action}에 실패했습니다`);
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      showError(`게시물 ${action}에 실패했습니다`);
    }
  };

  // Batch pin selected boards
  const handleBatchPin = async (activate: boolean) => {
    if (selectedBoards.length === 0) {
      showWarning('게시물을 선택해주세요');
      return;
    }

    const action = activate ? '고정' : '고정 해제';
    if (!confirm(`선택한 ${selectedBoards.length}개 게시물을 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      const endpoint = activate
        ? `/board/activate`
        : `/board/deActivate`;

      const response = await clientRequest.patch(endpoint, {
        boardIds: selectedBoards,
      });

      if (response.success) {
        showSuccess(`${selectedBoards.length}개 게시물이 ${action}되었습니다`);
        setSelectedBoards([]);
        fetchBoards(currentPage, selectedCategory);
      } else {
        showError(`게시물 ${action}에 실패했습니다`);
      }
    } catch (error) {
      console.error('Error batch pinning:', error);
      showError(`게시물 ${action}에 실패했습니다`);
    }
  };

  // Preview batch delete
  const handlePreviewBatchDelete = async () => {
    const beforeDate = new Date();
    beforeDate.setDate(beforeDate.getDate() - batchDaysAgo);

    const request: BatchHardDeleteRequest = {
      beforeDate: beforeDate.toISOString(),
      batchSize: 1000,
      boardOnly: false,
      commentOnly: false,
      executeDelete: false, // Preview only
    };

    try {
      const response = await clientRequest.post(
        `/board/batch/hard-delete`,
        request
      );

      if (response.success && response.data) {
        setBatchPreviewResult(response.data);
        showSuccess('삭제 예상 개수를 확인했습니다');
      } else {
        showError('배치 삭제 미리보기에 실패했습니다');
      }
    } catch (error) {
      console.error('Error previewing batch delete:', error);
      showError('배치 삭제 미리보기에 실패했습니다');
    }
  };

  // Execute batch delete
  const handleExecuteBatchDelete = async () => {
    if (!batchPreviewResult) {
      showWarning('먼저 삭제 예상 개수를 확인해주세요');
      return;
    }

    if (
      !confirm(
        `정말 ${batchPreviewResult.deletedBoardCount}개 게시물과 ${batchPreviewResult.deletedCommentCount}개 댓글을 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    const beforeDate = new Date();
    beforeDate.setDate(beforeDate.getDate() - batchDaysAgo);

    const request: BatchHardDeleteRequest = {
      beforeDate: beforeDate.toISOString(),
      batchSize: 1000,
      boardOnly: false,
      commentOnly: false,
      executeDelete: true, // Execute
    };

    try {
      const response = await clientRequest.post(
        `/board/batch/hard-delete`,
        request
      );

      if (response.success && response.data) {
        showSuccess(
          `${response.data.deletedBoardCount}개 게시물, ${response.data.deletedCommentCount}개 댓글이 영구 삭제되었습니다`
        );
        setBatchPreviewResult(null);
        setShowBatchModal(false);
        fetchBoards(currentPage, selectedCategory);
      } else {
        showError('배치 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error executing batch delete:', error);
      showError('배치 삭제에 실패했습니다');
    }
  };

  // Toggle board selection
  const toggleBoardSelection = (boardId: number) => {
    setSelectedBoards((prev) =>
      prev.includes(boardId)
        ? prev.filter((id) => id !== boardId)
        : [...prev, boardId]
    );
  };

  // Select all boards
  const handleSelectAll = () => {
    if (selectedBoards.length === boards.length) {
      setSelectedBoards([]);
    } else {
      setSelectedBoards(boards.map((b) => b.boardId));
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

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchBoards(currentPage - 1, selectedCategory);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchBoards(currentPage + 1, selectedCategory);
    }
  };

  // Category change handler
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    fetchBoards(1, categoryId);
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchBoards(1, 1);
  }, []);

  if (isLoading && boards.length === 0) {
    return (
      <LoadingContainer>
        <p>게시물 목록을 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  // Render board content
  const renderBoardsContent = () => (
    <div>
      {/* Statistics Cards */}
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>📝 전체 게시물</CardTitle>
          </CardHeader>
          <CardValue>{stats.totalBoards}</CardValue>
          <CardDescription>등록된 게시물 수</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📌 고정 게시물</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#fbbf24' }}>{stats.pinnedBoards}</CardValue>
          <CardDescription>현재 페이지 고정 게시물</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👁️ 총 조회수</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#3b82f6' }}>{stats.totalViews}</CardValue>
          <CardDescription>현재 페이지 누적 조회</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>❤️ 총 좋아요</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#22c55e' }}>{stats.totalLikes}</CardValue>
          <CardDescription>현재 페이지 누적 좋아요</CardDescription>
        </Card>
      </CardGrid>

      {/* Search and Filters */}
      <Card style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>🔍 검색 및 필터</CardTitle>
        </CardHeader>

        <FormGroup>
          <Label>카테고리 선택</Label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
            }}
          >
            <option value={1}>전체 카테고리</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup style={{ marginTop: '1rem' }}>
          <Label>게시물 ID 검색</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <InputForm
              type="number"
              value={searchBoardId}
              onChange={(e) => setSearchBoardId(e.target.value)}
              placeholder="게시물 ID 입력"
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearchBoard}>검색</Button>
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
          <Button onClick={() => fetchBoards(1, selectedCategory)}>
            🔄 목록 새로고침
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchBoardId('');
              setSearchMemberId('');
              fetchBoards(1, 1);
            }}
          >
            🔄 필터 초기화
          </Button>
        </ButtonGroup>
      </Card>

      {/* Batch Actions */}
      {selectedBoards.length > 0 && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <CardTitle>
              ⚡ 일괄 작업 ({selectedBoards.length}개 선택됨)
            </CardTitle>
          </CardHeader>
          <ButtonGroup>
            <Button onClick={() => handleBatchPin(true)}>📌 일괄 고정</Button>
            <Button onClick={() => handleBatchPin(false)}>
              📌 일괄 고정 해제
            </Button>
            <Button
              variant="danger"
              onClick={() => setSelectedBoards([])}
            >
              ❌ 선택 해제
            </Button>
          </ButtonGroup>
        </Card>
      )}

      {/* Batch Delete Section */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>🗑️ 배치 삭제 (소프트 삭제된 항목 영구 삭제)</CardTitle>
          <CardDescription>
            주의: 이 작업은 되돌릴 수 없습니다. 먼저 미리보기로 확인하세요.
          </CardDescription>
        </CardHeader>

        <FormGroup>
          <Label>삭제 기준 (며칠 전 이전 항목)</Label>
          <InputForm
            type="number"
            value={batchDaysAgo}
            onChange={(e) => setBatchDaysAgo(parseInt(e.target.value))}
            min="1"
            placeholder="30"
            style={{ width: '200px' }}
          />
        </FormGroup>

        {batchPreviewResult && (
          <div
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            <h4 style={{ marginBottom: '0.5rem', color: '#dc2626' }}>
              삭제 예상 항목
            </h4>
            <p style={{ margin: '0.25rem 0' }}>
              게시물: {batchPreviewResult.deletedBoardCount}개
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              댓글: {batchPreviewResult.deletedCommentCount}개
            </p>
          </div>
        )}

        <ButtonGroup style={{ marginTop: '1rem' }}>
          <Button variant="secondary" onClick={handlePreviewBatchDelete}>
            👁️ 삭제 예상 확인
          </Button>
          <Button
            variant="danger"
            onClick={handleExecuteBatchDelete}
            disabled={!batchPreviewResult}
          >
            🗑️ 영구 삭제 실행
          </Button>
        </ButtonGroup>
      </Card>

      {/* Boards Table */}
      <Card>
        <CardHeader>
          <CardTitle>📝 게시물 목록</CardTitle>
          <CardDescription>
            전체 {totalElements}개 게시물 중 {currentPage} / {totalPages} 페이지
          </CardDescription>
        </CardHeader>

        {boards.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>게시물이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>
                    <input
                      type="checkbox"
                      checked={selectedBoards.length === boards.length}
                      onChange={handleSelectAll}
                    />
                  </TableHeaderCell>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>제목</TableHeaderCell>
                  <TableHeaderCell>카테고리</TableHeaderCell>
                  <TableHeaderCell>작성자</TableHeaderCell>
                  <TableHeaderCell>조회수</TableHeaderCell>
                  <TableHeaderCell>좋아요</TableHeaderCell>
                  <TableHeaderCell>댓글</TableHeaderCell>
                  <TableHeaderCell>상태</TableHeaderCell>
                  <TableHeaderCell>생성일</TableHeaderCell>
                  <TableHeaderCell>작업</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {boards.map((board) => (
                  <TableRow key={board.boardId}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedBoards.includes(board.boardId)}
                        onChange={() => toggleBoardSelection(board.boardId)}
                      />
                    </TableCell>
                    <TableCell>{board.boardId}</TableCell>
                    <TableCell
                      style={{
                        maxWidth: '250px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {board.title}
                    </TableCell>
                    <TableCell>{board.categoryName}</TableCell>
                    <TableCell>{board.memberNickName}</TableCell>
                    <TableCell>{board.boardViewsCount}</TableCell>
                    <TableCell>{board.boardLikesCount}</TableCell>
                    <TableCell>{board.commentsCount}</TableCell>
                    <TableCell>
                      {board.isPin ? (
                        <StatusBadge status="warning">고정됨</StatusBadge>
                      ) : (
                        <StatusBadge status="success">일반</StatusBadge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(board.createdAt)}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="secondary"
                          onClick={() => handleTogglePin(board.boardId, board.isPin)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          {board.isPin ? '고정해제' : '고정'}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleSoftDelete(board.boardId)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
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
          </>
        )}
      </Card>
    </div>
  );

  return (
    <div>
      {/* Sub-tab Navigation */}
      <TabNav style={{ marginBottom: '1.5rem' }}>
        <TabButton
          active={activeSubTab === 'boards'}
          onClick={() => setActiveSubTab('boards')}
        >
          <span>📝</span>
          <span>게시물 관리</span>
        </TabButton>
        <TabButton
          active={activeSubTab === 'comments'}
          onClick={() => setActiveSubTab('comments')}
        >
          <span>💬</span>
          <span>댓글 관리</span>
        </TabButton>
        <TabButton
          active={activeSubTab === 'experts'}
          onClick={() => setActiveSubTab('experts')}
        >
          <span>🎓</span>
          <span>전문가 관리</span>
        </TabButton>
      </TabNav>

      {/* Content */}
      {activeSubTab === 'boards' && renderBoardsContent()}
      {activeSubTab === 'comments' && <CommentManagement />}
      {activeSubTab === 'experts' && <ExpertManagement />}
    </div>
  );
};

export default BoardManagement;
