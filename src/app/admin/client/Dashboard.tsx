'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import {
  DashboardStats,
  BatchHealth,
  RunningJobs,
  RateLimitStatus,
  JobExecutionInfo,
  ChatLogPage,
} from '../types';
import {
  Card,
  CardGrid,
  CardHeader,
  CardTitle,
  CardValue,
  CardDescription,
  Button,
  ButtonGroup,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableCell,
  StatusBadge,
  LoadingContainer,
  EmptyState,
  EmptyIcon,
  EmptyText,
} from './style';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { showSuccess, showError } = useGlobalAlert();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [batchHealth, setBatchHealth] = useState<BatchHealth | null>(null);
  const [runningJobs, setRunningJobs] = useState<JobExecutionInfo[]>([]);
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [recentJobHistory, setRecentJobHistory] = useState<JobExecutionInfo[]>(
    []
  );

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchBatchHealth(),
        fetchRunningJobs(),
        fetchRateLimitStatus(),
        fetchRecentChats(),
        fetchRecentJobHistory(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [categoriesRes, runningJobsRes, chatLogRes] = await Promise.all([
        clientRequest.get(`/category`),
        clientRequest.get(`/batch/cmc/running`),
        clientRequest.get(`/chat/allLog?page=1&size=1`),
      ]);

      const totalCategories =
        categoriesRes.success && categoriesRes.data?.categories
          ? categoriesRes.data.categories.length
          : 0;

      const runningBatchJobs =
        runningJobsRes.success && runningJobsRes.data
          ? runningJobsRes.data.runningJobsCount
          : 0;

      const recentChatMessages =
        chatLogRes.success && chatLogRes.data
          ? chatLogRes.data.totalElements
          : 0;

      let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';
      if (runningBatchJobs > 3) {
        systemHealth = 'warning';
      }

      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalCategories,
        runningBatchJobs,
        recentChatMessages,
        systemHealth,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBatchHealth = async () => {
    try {
      const response = await clientRequest.get<BatchHealth>(
        `/batch/cmc/health`
      );

      if (response.success && response.data) {
        setBatchHealth(response.data);
      }
    } catch (error) {
      console.error('Error fetching batch health:', error);
    }
  };

  const fetchRunningJobs = async () => {
    try {
      const response = await clientRequest.get<RunningJobs>(
        `/batch/cmc/running`
      );

      if (response.success && response.data) {
        setRunningJobs(response.data.runningJobs);
      }
    } catch (error) {
      console.error('Error fetching running jobs:', error);
    }
  };

  const fetchRateLimitStatus = async () => {
    try {
      const response = await clientRequest.get<RateLimitStatus>(
        `/batch/cmc/rate-limit-status`
      );

      if (response.success && response.data) {
        setRateLimitStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching rate limit status:', error);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const response = await clientRequest.get<ChatLogPage>(
        `/chat/allLog?page=1&size=5`
      );

      if (response.success && response.data) {
        setRecentChats(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  const fetchRecentJobHistory = async () => {
    try {
      const response = await clientRequest.get(
        `/batch/cmc/history?limit=5`
      );

      if (response.success && response.data) {
        setRecentJobHistory(response.data.executions || []);
      }
    } catch (error) {
      console.error('Error fetching job history:', error);
    }
  };

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

  const getStatusBadge = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'success';
      case 'RUNNING':
      case 'STARTED':
        return 'info';
      case 'FAILED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleNavigateToBatch = () => {
    router.push('/admin?tab=batch');
  };

  const handleNavigateToChat = () => {
    router.push('/admin?tab=chat');
  };

  const handleNavigateToCategory = () => {
    router.push('/admin?tab=category');
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchRunningJobs();
      fetchRateLimitStatus();
    }, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <p>대시보드 데이터를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.5rem',
            fontWeight: 700,
          }}
        >
          🎉 관리자 대시보드에 오신 것을 환영합니다
        </h2>
        <p style={{ color: '#888', margin: 0 }}>
          시스템 전체 현황을 한눈에 확인하세요
        </p>
      </Card>

      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>🏥 시스템 상태</CardTitle>
          </CardHeader>
          <CardValue
            style={{
              color:
                stats?.systemHealth === 'healthy'
                  ? '#22c55e'
                  : stats?.systemHealth === 'warning'
                  ? '#fbbf24'
                  : '#dc2626',
            }}
          >
            {stats?.systemHealth === 'healthy'
              ? '정상'
              : stats?.systemHealth === 'warning'
              ? '주의'
              : '오류'}
          </CardValue>
          <CardDescription>
            {batchHealth?.jobRepositoryConnected
              ? '모든 시스템 정상 작동 중'
              : '일부 시스템 점검 필요'}
          </CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📁 카테고리</CardTitle>
          </CardHeader>
          <CardValue>{stats?.totalCategories || 0}</CardValue>
          <CardDescription>등록된 게시판 카테고리</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ 실행 중인 배치</CardTitle>
          </CardHeader>
          <CardValue
            style={{
              color: (stats?.runningBatchJobs || 0) > 0 ? '#3b82f6' : '#888',
            }}
          >
            {stats?.runningBatchJobs || 0}
          </CardValue>
          <CardDescription>현재 실행 중인 작업</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💬 채팅 메시지</CardTitle>
          </CardHeader>
          <CardValue>{stats?.recentChatMessages || 0}</CardValue>
          <CardDescription>전체 채팅 메시지 수</CardDescription>
        </Card>
      </CardGrid>

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>⚡ 빠른 작업</CardTitle>
        </CardHeader>
        <ButtonGroup>
          <Button onClick={handleNavigateToBatch}>
            ⚙️ Batch 관리
          </Button>
          <Button variant="secondary" onClick={handleNavigateToChat}>
            💬 Chat 관리
          </Button>
          <Button variant="secondary" onClick={handleNavigateToCategory}>
            📁 카테고리 관리
          </Button>
          <Button variant="secondary" onClick={fetchDashboardData}>
            🔄 새로고침
          </Button>
        </ButtonGroup>
      </Card>

      {rateLimitStatus && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <CardTitle>⏱️ CMC API Rate Limit</CardTitle>
          </CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CardValue style={{ margin: 0 }}>
              {rateLimitStatus.currentUsage} / {rateLimitStatus.limit}
            </CardValue>
            <div
              style={{
                flex: 1,
                height: '12px',
                background: '#2a2a2a',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(rateLimitStatus.currentUsage / rateLimitStatus.limit) * 100}%`,
                  height: '100%',
                  background:
                    rateLimitStatus.currentUsage / rateLimitStatus.limit > 0.8
                      ? '#dc2626'
                      : rateLimitStatus.currentUsage / rateLimitStatus.limit > 0.5
                      ? '#fbbf24'
                      : '#22c55e',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
          <CardDescription style={{ marginTop: '0.5rem' }}>
            {rateLimitStatus.windowSeconds}초 윈도우 (
            {((rateLimitStatus.currentUsage / rateLimitStatus.limit) * 100).toFixed(
              1
            )}
            % 사용 중)
          </CardDescription>
        </Card>
      )}

      {runningJobs.length > 0 && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <CardTitle>▶️ 실행 중인 배치 작업</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Job ID</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>시작 시간</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {runningJobs.map((job) => (
                <TableRow key={job.jobExecutionId}>
                  <TableCell>{job.jobExecutionId}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusBadge(job.status)}>
                      {job.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(job.startTime)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>📜 최근 배치 작업 이력</CardTitle>
        </CardHeader>
        {recentJobHistory.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>최근 작업 이력이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Job ID</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>시작 시간</TableHeaderCell>
                <TableHeaderCell>Exit Code</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {recentJobHistory.slice(0, 5).map((job) => (
                <TableRow key={job.jobExecutionId}>
                  <TableCell>{job.jobExecutionId}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusBadge(job.status)}>
                      {job.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(job.startTime)}</TableCell>
                  <TableCell>{job.exitCode || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💬 최근 채팅 메시지</CardTitle>
        </CardHeader>
        {recentChats.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>최근 채팅 메시지가 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>닉네임</TableHeaderCell>
                <TableHeaderCell>메시지</TableHeaderCell>
                <TableHeaderCell>시간</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {recentChats.slice(0, 5).map((chat) => (
                <TableRow key={chat.id}>
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
                  <TableCell>{formatDate(chat.createdAt)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
