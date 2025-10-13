'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { ExpertApplicationItem, ExpertProfileItem } from '../types';
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

type ExpertSubTab = 'applications' | 'profiles';

const ExpertManagement: React.FC = () => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<ExpertSubTab>('applications');

  // 신청 상태 관리
  const [applications, setApplications] = useState<ExpertApplicationItem[]>([]);
  const [applicationPage, setApplicationPage] = useState(0);
  const [applicationTotalPages, setApplicationTotalPages] = useState(0);
  const [applicationTotalElements, setApplicationTotalElements] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<
    'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | ''
  >('');

  // 프로필 상태 관리
  const [profiles, setProfiles] = useState<ExpertProfileItem[]>([]);
  const [profilePage, setProfilePage] = useState(0);
  const [profileTotalPages, setProfileTotalPages] = useState(0);
  const [profileTotalElements, setProfileTotalElements] = useState(0);

  // 거부 모달 상태 관리
  const [rejectingApplicationId, setRejectingApplicationId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // 통계 상태 관리
  const [applicationStats, setApplicationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  // 신청 목록 조회
  const fetchApplications = async (page: number = 0) => {
    setIsLoading(true);
    try {
      let endpoint = `${clientEnv.API_BASE_URL}/community/expert/admin/applications?page=${page}&size=20`;
      if (selectedStatus) {
        endpoint += `&status=${selectedStatus}`;
      }

      const response = await clientRequest.get(endpoint);

      if (response.success && response.data) {
        setApplications(response.data.content || []);
        setApplicationTotalPages(response.data.totalPages || 0);
        setApplicationTotalElements(response.data.totalElements || 0);
        setApplicationPage(page);
      } else {
        showError('전문가 신청 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      showError('전문가 신청 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 목록 조회
  const fetchProfiles = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const endpoint = `${clientEnv.API_BASE_URL}/community/expert/admin/profiles?page=${page}&size=20`;
      const response = await clientRequest.get(endpoint);

      if (response.success && response.data) {
        setProfiles(response.data.content || []);
        setProfileTotalPages(response.data.totalPages || 0);
        setProfileTotalElements(response.data.totalElements || 0);
        setProfilePage(page);
      } else {
        showError('전문가 프로필 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      showError('전문가 프로필 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 신청 통계 조회
  const fetchApplicationStats = async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        clientRequest.get(
          `${clientEnv.API_BASE_URL}/community/expert/admin/applications?status=PENDING&page=0&size=1`
        ),
        clientRequest.get(
          `${clientEnv.API_BASE_URL}/community/expert/admin/applications?status=APPROVED&page=0&size=1`
        ),
        clientRequest.get(
          `${clientEnv.API_BASE_URL}/community/expert/admin/applications?status=REJECTED&page=0&size=1`
        ),
      ]);

      setApplicationStats({
        pending: pendingRes.data?.totalElements || 0,
        approved: approvedRes.data?.totalElements || 0,
        rejected: rejectedRes.data?.totalElements || 0,
        total:
          (pendingRes.data?.totalElements || 0) +
          (approvedRes.data?.totalElements || 0) +
          (rejectedRes.data?.totalElements || 0),
      });
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (activeSubTab === 'applications') {
      fetchApplications(0);
      fetchApplicationStats();
    } else {
      fetchProfiles(0);
    }
  }, [activeSubTab, selectedStatus]);

  // 신청 승인
  const handleApprove = async (applicationId: number) => {
    if (!confirm('이 전문가 신청을 승인하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `${clientEnv.API_BASE_URL}/community/expert/admin/applications/${applicationId}/approve`
      );

      if (response.success) {
        showSuccess('전문가 신청이 승인되었습니다');
        fetchApplications(applicationPage);
        fetchApplicationStats();
      } else {
        showError('전문가 신청 승인에 실패했습니다');
      }
    } catch (error) {
      console.error('Error approving application:', error);
      showError('전문가 신청 승인에 실패했습니다');
    }
  };

  // 거부 모달 열기
  const handleRejectClick = (applicationId: number) => {
    setRejectingApplicationId(applicationId);
    setRejectionReason('');
  };

  // 거부 제출
  const handleRejectSubmit = async () => {
    if (!rejectingApplicationId) return;

    if (!rejectionReason.trim()) {
      showWarning('거부 사유를 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.post(
        `${clientEnv.API_BASE_URL}/community/expert/admin/applications/${rejectingApplicationId}/reject`,
        { rejectionReason }
      );

      if (response.success) {
        showSuccess('전문가 신청이 거부되었습니다');
        setRejectingApplicationId(null);
        setRejectionReason('');
        fetchApplications(applicationPage);
        fetchApplicationStats();
      } else {
        showError('전문가 신청 거부에 실패했습니다');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      showError('전문가 신청 거부에 실패했습니다');
    }
  };

  // 프로필 활성화
  const handleActivateProfile = async (profileId: number) => {
    if (!confirm('이 전문가 프로필을 활성화하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `${clientEnv.API_BASE_URL}/community/expert/admin/profiles/${profileId}/activate`
      );

      if (response.success) {
        showSuccess('전문가 프로필이 활성화되었습니다');
        fetchProfiles(profilePage);
      } else {
        showError('전문가 프로필 활성화에 실패했습니다');
      }
    } catch (error) {
      console.error('Error activating profile:', error);
      showError('전문가 프로필 활성화에 실패했습니다');
    }
  };

      // 프로필 비활성화
  const handleDeactivateProfile = async (profileId: number) => {
    if (!confirm('이 전문가 프로필을 비활성화하시겠습니까?')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `${clientEnv.API_BASE_URL}/community/expert/admin/profiles/${profileId}/deactivate`
      );

      if (response.success) {
        showSuccess('전문가 프로필이 비활성화되었습니다');
        fetchProfiles(profilePage);
      } else {
        showError('전문가 프로필 비활성화에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deactivating profile:', error);
      showError('전문가 프로필 비활성화에 실패했습니다');
    }
  };

  // 전문가 자격 박탈
  const handleRevokeStatus = async (memberId: number) => {
    if (!confirm('이 사용자의 전문가 자격을 완전히 박탈하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `${clientEnv.API_BASE_URL}/community/expert/admin/members/${memberId}/revoke`
      );

      if (response.success) {
        showSuccess('전문가 자격이 박탈되었습니다');
        fetchProfiles(profilePage);
      } else {
        showError('전문가 자격 박탈에 실패했습니다');
      }
    } catch (error) {
      console.error('Error revoking expert status:', error);
      showError('전문가 자격 박탈에 실패했습니다');
    }
  };

  // 날짜 포맷
  const formatDate = (dateValue: string | number[]) => {
    try {
      // parseDate를 사용하여 배열 형식도 처리
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

  // 상태 배지 색상 가져오기
  const getStatusBadgeType = (
    status: string
  ): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'info';
    }
  };

  // 신청 내용 렌더링
  const renderApplicationsContent = () => (
    <div>
      {/* 통계 카드 */}
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>📋 전체 신청</CardTitle>
          </CardHeader>
          <CardValue>{applicationStats.total}</CardValue>
          <CardDescription>누적 전문가 신청</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⏳ 대기중</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#fbbf24' }}>{applicationStats.pending}</CardValue>
          <CardDescription>검토 대기</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ 승인됨</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#22c55e' }}>{applicationStats.approved}</CardValue>
          <CardDescription>승인된 신청</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>❌ 거부됨</CardTitle>
          </CardHeader>
          <CardValue style={{ color: '#ef4444' }}>{applicationStats.rejected}</CardValue>
          <CardDescription>거부된 신청</CardDescription>
        </Card>
      </CardGrid>

      {/* 필터 섹션 */}
      <Card style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>🔍 필터</CardTitle>
          <CardDescription>상태별로 전문가 신청을 필터링하세요</CardDescription>
        </CardHeader>

        <FormGroup>
          <Label>신청 상태</Label>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | ''
              )
            }
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
            }}
          >
            <option value="">전체 상태</option>
            <option value="PENDING">대기중</option>
            <option value="APPROVED">승인됨</option>
            <option value="REJECTED">거부됨</option>
            <option value="CANCELLED">취소됨</option>
          </select>
        </FormGroup>
      </Card>

      {/* 신청 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>📋 전문가 신청 목록</CardTitle>
          <CardDescription>
            {applicationTotalElements > 0
              ? `전체 ${applicationTotalElements}개 신청 중 ${applicationPage + 1} / ${applicationTotalPages} 페이지`
              : '전문가 신청이 없습니다'}
          </CardDescription>
        </CardHeader>

        {isLoading && applications.length === 0 ? (
          <LoadingContainer>
            <p>신청 목록을 불러오는 중...</p>
          </LoadingContainer>
        ) : applications.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>전문가 신청이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>신청자</TableHeaderCell>
                  <TableHeaderCell>전문 분야</TableHeaderCell>
                  <TableHeaderCell>설명</TableHeaderCell>
                  <TableHeaderCell>자격증명</TableHeaderCell>
                  <TableHeaderCell>포트폴리오</TableHeaderCell>
                  <TableHeaderCell>상태</TableHeaderCell>
                  <TableHeaderCell>신청일</TableHeaderCell>
                  <TableHeaderCell>작업</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>{application.id}</TableCell>
                    <TableCell>
                      <div>{application.memberNickname}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        ID: {application.memberId}
                      </div>
                    </TableCell>
                    <TableCell>{application.expertiseField}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {application.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {application.credentials}
                      </span>
                    </TableCell>
                    <TableCell>
                      {application.portfolioUrl ? (
                        <a
                          href={application.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          링크
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusBadgeType(application.status)}>
                        {application.statusDescription}
                      </StatusBadge>
                      {application.rejectionReason && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#ef4444',
                            marginTop: '0.25rem',
                          }}
                        >
                          사유: {application.rejectionReason}
                        </div>
                      )}
                      {application.reviewerNickname && (
                        <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                          검토자: {application.reviewerNickname}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                    <TableCell>
                      {application.status === 'PENDING' && (
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            onClick={() => handleApprove(application.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            승인
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRejectClick(application.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            거부
                          </Button>
                        </ButtonGroup>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {/* 페이지네이션 */}
            {applicationTotalPages > 1 && (
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
                  onClick={() => fetchApplications(applicationPage - 1)}
                  disabled={applicationPage === 0}
                  variant="secondary"
                >
                  이전
                </Button>
                <span style={{ color: '#888' }}>
                  {applicationPage + 1} / {applicationTotalPages}
                </span>
                <Button
                  onClick={() => fetchApplications(applicationPage + 1)}
                  disabled={applicationPage === applicationTotalPages - 1}
                  variant="secondary"
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* 거부 모달 */}
      {rejectingApplicationId && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setRejectingApplicationId(null)}
        >
          <Card
            style={{
              maxWidth: '500px',
              width: '90%',
              margin: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>전문가 신청 거부</CardTitle>
              <CardDescription>거부 사유를 입력해주세요</CardDescription>
            </CardHeader>

            <FormGroup>
              <Label>거부 사유</Label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="거부 사유를 상세히 입력해주세요"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </FormGroup>

            <ButtonGroup style={{ marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setRejectingApplicationId(null)}>
                취소
              </Button>
              <Button variant="danger" onClick={handleRejectSubmit}>
                거부 확정
              </Button>
            </ButtonGroup>
          </Card>
        </div>
      )}
    </div>
  );

  // 프로필 내용 렌더링
  const renderProfilesContent = () => (
    <div>
      {/* 프로필 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>👤 전문가 프로필 목록</CardTitle>
          <CardDescription>
            {profileTotalElements > 0
              ? `전체 ${profileTotalElements}개 프로필 중 ${profilePage + 1} / ${profileTotalPages} 페이지`
              : '전문가 프로필이 없습니다'}
          </CardDescription>
        </CardHeader>

        {isLoading && profiles.length === 0 ? (
          <LoadingContainer>
            <p>프로필 목록을 불러오는 중...</p>
          </LoadingContainer>
        ) : profiles.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>전문가 프로필이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>전문가</TableHeaderCell>
                  <TableHeaderCell>전문 분야</TableHeaderCell>
                  <TableHeaderCell>소개</TableHeaderCell>
                  <TableHeaderCell>포트폴리오</TableHeaderCell>
                  <TableHeaderCell>활성 상태</TableHeaderCell>
                  <TableHeaderCell>게시물 수</TableHeaderCell>
                  <TableHeaderCell>팔로워 수</TableHeaderCell>
                  <TableHeaderCell>생성일</TableHeaderCell>
                  <TableHeaderCell>작업</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.id}</TableCell>
                    <TableCell>
                      <div>{profile.memberNickname}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        ID: {profile.memberId}
                      </div>
                    </TableCell>
                    <TableCell>{profile.expertiseField}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          maxWidth: '250px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {profile.bio}
                      </span>
                    </TableCell>
                    <TableCell>
                      {profile.portfolioUrl ? (
                        <a
                          href={profile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'underline' }}
                        >
                          링크
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={profile.isActive ? 'success' : 'error'}>
                        {profile.isActive ? '활성화' : '비활성화'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{profile.articlesCount}</TableCell>
                    <TableCell>{profile.followersCount}</TableCell>
                    <TableCell>{formatDate(profile.createdAt)}</TableCell>
                    <TableCell>
                      <ButtonGroup>
                        {profile.isActive ? (
                          <Button
                            variant="secondary"
                            onClick={() => handleDeactivateProfile(profile.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            비활성화
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleActivateProfile(profile.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            활성화
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          onClick={() => handleRevokeStatus(profile.memberId)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.875rem',
                          }}
                        >
                          자격박탈
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {/* 페이지네이션 */}
            {profileTotalPages > 1 && (
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
                  onClick={() => fetchProfiles(profilePage - 1)}
                  disabled={profilePage === 0}
                  variant="secondary"
                >
                  이전
                </Button>
                <span style={{ color: '#888' }}>
                  {profilePage + 1} / {profileTotalPages}
                </span>
                <Button
                  onClick={() => fetchProfiles(profilePage + 1)}
                  disabled={profilePage === profileTotalPages - 1}
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

  return (
    <div>
      <TabNav style={{ marginBottom: '1.5rem' }}>
        <TabButton
          active={activeSubTab === 'applications'}
          onClick={() => setActiveSubTab('applications')}
        >
          <span>📋</span>
          <span>신청 관리</span>
        </TabButton>
        <TabButton active={activeSubTab === 'profiles'} onClick={() => setActiveSubTab('profiles')}>
          <span>👤</span>
          <span>프로필 관리</span>
        </TabButton>
      </TabNav>

      {activeSubTab === 'applications' ? renderApplicationsContent() : renderProfilesContent()}
    </div>
  );
};

export default ExpertManagement;
