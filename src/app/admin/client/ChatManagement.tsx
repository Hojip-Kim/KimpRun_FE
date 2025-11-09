'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { ChatLog, ChatLogPage } from '../types';
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
} from './style';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const ChatManagement: React.FC = () => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<ChatLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(20);

  // Statistics
  const [stats, setStats] = useState({
    totalMessages: 0,
    authMessages: 0,
    guestMessages: 0,
    deletedMessages: 0,
  });

  // Fetch chat logs
  const fetchChatLogs = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get<ChatLogPage>(
        `/chat/allLog?page=${page}&size=${pageSize}`
      );

      if (response.success && response.data) {
        setChats(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(page);

        // Calculate statistics
        const authCount = response.data.content.filter(
          (chat) => chat.isAuth
        ).length;
        const guestCount = response.data.content.filter(
          (chat) => !chat.isAuth
        ).length;
        const deletedCount = response.data.content.filter(
          (chat) => chat.isDeleted
        ).length;

        setStats({
          totalMessages: response.data.totalElements,
          authMessages: authCount,
          guestMessages: guestCount,
          deletedMessages: deletedCount,
        });
      } else {
        showError('채팅 로그를 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching chat logs:', error);
      showError('채팅 로그를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete chat message
  const handleDeleteChat = async (inherenceId: number) => {
    if (!confirm('정말 이 메시지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `/chat/admin`,
        {
          inherenceId,
        }
      );

      if (response.success) {
        showSuccess('메시지가 삭제되었습니다');
        fetchChatLogs(currentPage);
      } else {
        showError('메시지 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      showError('메시지 삭제에 실패했습니다');
    }
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchChatLogs(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchChatLogs(currentPage + 1);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return dateString;
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchChatLogs(1);
  }, []);

  if (isLoading && chats.length === 0) {
    return (
      <LoadingContainer>
        <p>채팅 로그를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <div>
      {/* Statistics Cards */}
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>💬 전체 메시지</CardTitle>
          </CardHeader>
          <CardValue>{stats.totalMessages}</CardValue>
          <CardDescription>누적 채팅 메시지 수</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔐 인증 사용자</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#3b82f6' }}>
            {stats.authMessages}
          </CardValue>
          <CardDescription>현재 페이지 인증 메시지</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👤 게스트 사용자</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#fbbf24' }}>
            {stats.guestMessages}
          </CardValue>
          <CardDescription>현재 페이지 게스트 메시지</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🗑️ 삭제된 메시지</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#dc2626' }}>
            {stats.deletedMessages}
          </CardValue>
          <CardDescription>현재 페이지 삭제된 메시지</CardDescription>
        </Card>
      </CardGrid>

      {/* Actions */}
      <Card style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
        <CardHeader>
          <CardTitle>⚡ 빠른 작업</CardTitle>
        </CardHeader>
        <ButtonGroup>
          <Button onClick={() => fetchChatLogs(currentPage)}>
            🔄 새로고침
          </Button>
          <Button variant="secondary" onClick={() => fetchChatLogs(1)}>
            ⏮️ 첫 페이지로
          </Button>
        </ButtonGroup>
      </Card>

      {/* Chat Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>💬 채팅 로그</CardTitle>
          <CardDescription>
            전체 {totalElements}개 메시지 중 {currentPage} / {totalPages}{' '}
            페이지
          </CardDescription>
        </CardHeader>

        {chats.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>채팅 메시지가 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>닉네임</TableHeaderCell>
                  <TableHeaderCell>메시지</TableHeaderCell>
                  <TableHeaderCell>타입</TableHeaderCell>
                  <TableHeaderCell>상태</TableHeaderCell>
                  <TableHeaderCell>생성 시간</TableHeaderCell>
                  <TableHeaderCell>작업</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {chats.map((chat) => (
                  <TableRow key={chat.id}>
                    <TableCell>{chat.id}</TableCell>
                    <TableCell>
                      {chat.nickname || '익명'}
                      {chat.isAuth && ' 🔐'}
                    </TableCell>
                    <TableCell
                      style={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {chat.message}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={chat.isAuth ? 'info' : 'warning'}>
                        {chat.isAuth ? '인증' : '게스트'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={chat.isDeleted ? 'error' : 'success'}
                      >
                        {chat.isDeleted ? '삭제됨' : '활성'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{formatDate(chat.createdAt)}</TableCell>
                    <TableCell>
                      {!chat.isDeleted && (
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteChat(chat.id)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          삭제
                        </Button>
                      )}
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
};

export default ChatManagement;
