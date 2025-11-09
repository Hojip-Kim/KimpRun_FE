'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import {
  BatchJobHistory,
  RunningJobs,
  BatchHealth,
  RateLimitStatus,
  CmcApiStatus,
  JobExecutionInfo,
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

const BatchManagement: React.FC = () => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [jobHistory, setJobHistory] = useState<JobExecutionInfo[]>([]);
  const [runningJobs, setRunningJobs] = useState<JobExecutionInfo[]>([]);
  const [batchHealth, setBatchHealth] = useState<BatchHealth | null>(null);
  const [rateLimitStatus, setRateLimitStatus] =
    useState<RateLimitStatus | null>(null);
  const [cmcApiStatus, setCmcApiStatus] = useState<CmcApiStatus | null>(null);

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchJobHistory(),
        fetchRunningJobs(),
        fetchBatchHealth(),
        fetchRateLimitStatus(),
        fetchCmcApiStatus(),
      ]);
    } catch (error) {
      console.error('Error fetching batch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch job history
  const fetchJobHistory = async () => {
    try {
      const response = await clientRequest.get<BatchJobHistory>(
        `/batch/cmc/history?limit=10`
      );

      if (response.success && response.data) {
        setJobHistory(response.data.executions);
      }
    } catch (error) {
      console.error('Error fetching job history:', error);
    }
  };

  // Fetch running jobs
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

  // Fetch batch health
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

  // Fetch rate limit status
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

  // Fetch CMC API status
  const fetchCmcApiStatus = async () => {
    try {
      const response = await clientRequest.get<CmcApiStatus>(
        `/batch/cmc/api-status`
      );

      if (response.success && response.data) {
        setCmcApiStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching CMC API status:', error);
    }
  };

  // Trigger batch sync
  const handleTriggerSync = async () => {
    if (isSyncing) return;

    const confirmed = window.confirm(
      'CMC 배치 동기화를 실행하시겠습니까?\n이 작업은 시간이 걸릴 수 있습니다.'
    );

    if (!confirmed) return;

    setIsSyncing(true);
    try {
      const response = await clientRequest.post(
        `/batch/cmc/sync?mode=manual`
      );

      if (response.success) {
        showSuccess('배치 작업이 시작되었습니다');
        setTimeout(() => {
          fetchAllData();
        }, 2000);
      } else {
        showError(`배치 실행 실패: ${response.error}`);
      }
    } catch (error) {
      showError('배치 실행 중 오류가 발생했습니다');
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset rate limit
  const handleResetRateLimit = async () => {
    const confirmed = window.confirm(
      'Rate Limit을 리셋하시겠습니까?\n이 작업은 신중히 수행해야 합니다.'
    );

    if (!confirmed) return;

    try {
      const response = await clientRequest.post(
        `/batch/cmc/reset-rate-limit`
      );

      if (response.success) {
        showSuccess('Rate Limit이 리셋되었습니다');
        fetchRateLimitStatus();
      } else {
        showError(`Rate Limit 리셋 실패: ${response.error}`);
      }
    } catch (error) {
      showError('Rate Limit 리셋 중 오류가 발생했습니다');
    }
  };

  // Force unlock
  const handleForceUnlock = async () => {
    const confirmed = window.confirm(
      '분산 락을 강제로 해제하시겠습니까?\n다른 서버에서 배치가 실행 중일 수 있으므로 신중히 수행해야 합니다.'
    );

    if (!confirmed) return;

    try {
      const response = await clientRequest.post(
        `/batch/cmc/unlock`
      );

      if (response.success) {
        showSuccess('분산 락이 해제되었습니다');
      } else {
        showWarning(`락 해제 실패: ${response.error}`);
      }
    } catch (error) {
      showError('락 해제 중 오류가 발생했습니다');
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

  // Get status badge
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
      case 'STOPPED':
      case 'ABANDONED':
        return 'warning';
      default:
        return 'info';
    }
  };

  // Auto refresh
  useEffect(() => {
    fetchAllData();

    const interval = setInterval(() => {
      fetchRunningJobs();
      fetchRateLimitStatus();
    }, 10000); // 10초마다 실행 중인 작업과 Rate Limit 갱신

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <p>배치 관리 데이터를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <div>
      {/* Overview Cards */}
      <CardGrid>
        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle>🏥 시스템 상태</CardTitle>
          </CardHeader>
          <CardValue
            style={{
              color: batchHealth?.jobRepositoryConnected ? '#22c55e' : '#dc2626',
            }}
          >
            {batchHealth?.jobRepositoryConnected ? '정상' : '오류'}
          </CardValue>
          <CardDescription>
            {batchHealth?.targetJobExists
              ? 'CMC 배치 작업 사용 가능'
              : '배치 작업을 찾을 수 없습니다'}
          </CardDescription>
        </Card>

        {/* Running Jobs Count */}
        <Card>
          <CardHeader>
            <CardTitle>▶️ 실행 중인 작업</CardTitle>
          </CardHeader>
          <CardValue>{runningJobs.length}</CardValue>
          <CardDescription>
            현재 실행 중인 배치 작업 개수
          </CardDescription>
        </Card>

        {/* Rate Limit */}
        <Card>
          <CardHeader>
            <CardTitle>⏱️ Rate Limit</CardTitle>
          </CardHeader>
          <CardValue>
            {rateLimitStatus?.currentUsage || 0} / {rateLimitStatus?.limit || 30}
          </CardValue>
          <CardDescription>
            {rateLimitStatus?.windowSeconds || 60}초 윈도우
          </CardDescription>
        </Card>

        {/* Total Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>📜 작업 이력</CardTitle>
          </CardHeader>
          <CardValue>{jobHistory.length}</CardValue>
          <CardDescription>최근 실행된 배치 작업</CardDescription>
        </Card>
      </CardGrid>

      {/* Action Buttons */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>⚙️ 배치 작업 제어</CardTitle>
        </CardHeader>
        <ButtonGroup>
          <Button onClick={handleTriggerSync} disabled={isSyncing}>
            {isSyncing ? '실행 중...' : '🚀 배치 실행'}
          </Button>
          <Button variant="secondary" onClick={fetchAllData}>
            🔄 새로고침
          </Button>
          <Button variant="danger" onClick={handleResetRateLimit}>
            ⚠️ Rate Limit 리셋
          </Button>
          <Button variant="danger" onClick={handleForceUnlock}>
            🔓 강제 락 해제
          </Button>
        </ButtonGroup>
      </Card>

      {/* Running Jobs */}
      {runningJobs.length > 0 && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <CardHeader>
            <CardTitle>▶️ 실행 중인 작업</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Job ID</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>시작 시간</TableHeaderCell>
                <TableHeaderCell>실행 중인 Step</TableHeaderCell>
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
                  <TableCell>
                    {job.runningSteps?.join(', ') || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Job History */}
      <Card>
        <CardHeader>
          <CardTitle>📜 작업 실행 이력</CardTitle>
        </CardHeader>
        {jobHistory.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>실행 이력이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Job ID</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>시작 시간</TableHeaderCell>
                <TableHeaderCell>종료 시간</TableHeaderCell>
                <TableHeaderCell>Exit Code</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {jobHistory.map((job) => (
                <TableRow key={job.jobExecutionId}>
                  <TableCell>{job.jobExecutionId}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusBadge(job.status)}>
                      {job.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(job.startTime)}</TableCell>
                  <TableCell>
                    {job.endTime ? formatDate(job.endTime) : 'N/A'}
                  </TableCell>
                  <TableCell>{job.exitCode || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* CMC API Status */}
      {cmcApiStatus && (
        <Card style={{ marginTop: '1.5rem' }}>
          <CardHeader>
            <CardTitle>📊 CMC API 상태</CardTitle>
          </CardHeader>
          <CardDescription>{cmcApiStatus.status}</CardDescription>
        </Card>
      )}
    </div>
  );
};

export default BatchManagement;
