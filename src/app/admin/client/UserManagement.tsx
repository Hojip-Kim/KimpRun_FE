'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { RoleInfo, DeclarationItem, UserDetailInfo, UserRoleType, UserRoleFullType } from '../types';
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

type UserSubTab = 'roles' | 'declarations';

interface UserManagementProps {
  initialTab?: UserSubTab;
}

const UserManagement: React.FC<UserManagementProps> = ({ initialTab = 'roles' }) => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<UserSubTab>(initialTab);

  // 권한 상태 관리
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [newRoleKey, setNewRoleKey] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [updatingRole, setUpdatingRole] = useState<RoleInfo | null>(null);

  // 사용자 권한 업데이트 상태 관리
  const [searchUserId, setSearchUserId] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<UserDetailInfo | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('USER');

  // 신고 상태 관리
  const [declarations, setDeclarations] = useState<DeclarationItem[]>([]);
  const [declarationPage, setDeclarationPage] = useState(0);
  const [declarationTotalPages, setDeclarationTotalPages] = useState(0);
  const [declarationTotalElements, setDeclarationTotalElements] = useState(0);

  // 모든 권한 조회
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get(`${clientEnv.API_BASE_URL}/role`);

      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        showError('권한 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      showError('권한 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 신고 조회
  const fetchDeclarations = async (page: number = 0) => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get(
        `${clientEnv.API_BASE_URL}/declaration?page=${page}&size=20`
      );

      if (response.success && response.data) {
        setDeclarations(response.data.content || []);
        setDeclarationTotalPages(response.data.totalPages || 0);
        setDeclarationTotalElements(response.data.totalElements || 0);
        setDeclarationPage(page);
      } else {
        showError('신고 목록을 불러오는데 실패했습니다');
      }
    } catch (error) {
      console.error('Error fetching declarations:', error);
      showError('신고 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (activeSubTab === 'roles') {
      fetchRoles();
    } else if (activeSubTab === 'declarations') {
      fetchDeclarations(0);
    }
  }, [activeSubTab]);

  // ID로 사용자 검색
  const handleSearchUser = async () => {
    if (!searchUserId || searchUserId.trim() === '') {
      showWarning('사용자 ID를 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.get(
        `${clientEnv.API_BASE_URL}/user/${parseInt(searchUserId)}`
      );

      if (response.success && response.data) {
        setSearchedUser(response.data);
        // ROLE_USER를 USER 형식으로 변환하여 선택
        const roleShort = response.data.role.replace('ROLE_', '') as UserRoleType;
        setSelectedRole(roleShort);
        showSuccess('사용자 정보를 찾았습니다');
      } else {
        showError('사용자를 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showError('사용자 검색에 실패했습니다');
    }
  };

  // 사용자 권한 업데이트
  const handleUpdateUserRole = async () => {
    if (!searchedUser) {
      showWarning('먼저 사용자를 검색해주세요');
      return;
    }

    if (!confirm(`${searchedUser.nickname} 사용자의 권한을 ${selectedRole}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const response = await clientRequest.patch(`${clientEnv.API_BASE_URL}/user/update/role`, {
        userId: parseInt(searchUserId),
        role: selectedRole,
      });

      if (response.success) {
        showSuccess('사용자 권한이 변경되었습니다');
        handleSearchUser(); // 사용자 정보 새로고침
      } else {
        showError('사용자 권한 변경에 실패했습니다');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('사용자 권한 변경에 실패했습니다');
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async () => {
    if (!searchedUser) {
      showWarning('먼저 사용자를 검색해주세요');
      return;
    }

    if (
      !confirm(
        `${searchedUser.nickname} 사용자를 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    try {
      const response = await clientRequest.delete(`${clientEnv.API_BASE_URL}/user/delete`, {
        body: JSON.stringify({ userId: parseInt(searchUserId) }),
      });

      if (response.success) {
        showSuccess('사용자가 삭제되었습니다');
        setSearchedUser(null);
        setSearchUserId('');
      } else {
        showError('사용자 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('사용자 삭제에 실패했습니다');
    }
  };

  // 권한 생성
  const handleCreateRole = async () => {
    if (!newRoleKey.trim() || !newRoleName.trim()) {
      showWarning('권한 키와 이름을 모두 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.post(`${clientEnv.API_BASE_URL}/role`, {
        roleKey: newRoleKey,
        roleName: newRoleName,
      });

      if (response.success) {
        showSuccess('권한이 생성되었습니다');
        setShowCreateRoleModal(false);
        setNewRoleKey('');
        setNewRoleName('');
        fetchRoles();
      } else {
        showError('권한 생성에 실패했습니다');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      showError('권한 생성에 실패했습니다');
    }
  };

  // 권한 업데이트
  const handleUpdateRole = async () => {
    if (!updatingRole || !newRoleName.trim()) {
      showWarning('권한 이름을 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.put(
        `${clientEnv.API_BASE_URL}/role/${updatingRole.id}`,
        {
          roleName: newRoleName,
        }
      );

      if (response.success) {
        showSuccess('권한이 업데이트되었습니다');
        setShowUpdateRoleModal(false);
        setUpdatingRole(null);
        setNewRoleName('');
        fetchRoles();
      } else {
        showError('권한 업데이트에 실패했습니다');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showError('권한 업데이트에 실패했습니다');
    }
  };

  // 권한 삭제
  const handleDeleteRole = async (roleId: number, roleName: string) => {
    if (!confirm(`${roleName} 권한을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await clientRequest.delete(`${clientEnv.API_BASE_URL}/role/${roleId}`);

      if (response.success) {
        showSuccess('권한이 삭제되었습니다');
        fetchRoles();
      } else {
        showError('권한 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      showError('권한 삭제에 실패했습니다');
    }
  };

  // 날짜 포맷
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

  // 권한 내용 렌더링
  const renderRolesContent = () => (
    <div>
      {/* 사용자 검색과 권한 업데이트 섹션 */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>👤 사용자 권한 관리</CardTitle>
          <CardDescription>사용자 ID로 검색하여 권한을 변경하거나 삭제할 수 있습니다</CardDescription>
        </CardHeader>

        <FormGroup>
          <Label>사용자 ID로 검색</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <InputForm
              type="number"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="사용자 ID 입력"
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearchUser}>검색</Button>
          </div>
        </FormGroup>

        {searchedUser && (
          <>
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>이메일:</strong> {searchedUser.email}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>닉네임:</strong> {searchedUser.nickname}
              </div>
              <div>
                <strong>현재 권한:</strong>{' '}
                <StatusBadge status="info">{searchedUser.role}</StatusBadge>
              </div>
            </div>

            <FormGroup style={{ marginTop: '1rem' }}>
              <Label>새 권한 선택</Label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRoleType)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                }}
              >
                <option value="USER">USER</option>
                <option value="INFLUENCER">INFLUENCER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="OPERATOR">OPERATOR</option>
              </select>
            </FormGroup>

            <ButtonGroup style={{ marginTop: '1rem' }}>
              <Button variant="primary" onClick={handleUpdateUserRole}>
                권한 변경
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                사용자 삭제
              </Button>
            </ButtonGroup>
          </>
        )}
      </Card>

      {/* 권한 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>🔑 권한 목록</CardTitle>
          <CardDescription>시스템에 등록된 모든 권한</CardDescription>
          <ButtonGroup>
            <Button onClick={() => setShowCreateRoleModal(true)}>➕ 권한 추가</Button>
          </ButtonGroup>
        </CardHeader>

        {isLoading && roles.length === 0 ? (
          <LoadingContainer>
            <p>권한 목록을 불러오는 중...</p>
          </LoadingContainer>
        ) : roles.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>등록된 권한이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>권한 키</TableHeaderCell>
                <TableHeaderCell>권한 이름</TableHeaderCell>
                <TableHeaderCell>생성일</TableHeaderCell>
                <TableHeaderCell>수정일</TableHeaderCell>
                <TableHeaderCell>작업</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.roleKey}</TableCell>
                  <TableCell>
                    <StatusBadge status="info">{role.roleName}</StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
                  <TableCell>{formatDate(role.updatedAt)}</TableCell>
                  <TableCell>
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setUpdatingRole(role);
                          setNewRoleName(role.roleName);
                          setShowUpdateRoleModal(true);
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteRole(role.id, role.roleName)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        삭제
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* 권한 추가 모달 */}
      {showCreateRoleModal && (
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
          onClick={() => setShowCreateRoleModal(false)}
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
              <CardTitle>권한 추가</CardTitle>
              <CardDescription>새로운 권한을 생성합니다</CardDescription>
            </CardHeader>

            <FormGroup>
              <Label>권한 키 (예: ROLE_CUSTOM)</Label>
              <InputForm
                value={newRoleKey}
                onChange={(e) => setNewRoleKey(e.target.value)}
                placeholder="권한 키 입력"
              />
            </FormGroup>

            <FormGroup style={{ marginTop: '1rem' }}>
              <Label>권한 이름</Label>
              <select
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              >
                <option value="">선택하세요</option>
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_INFLUENCER">ROLE_INFLUENCER</option>
                <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                <option value="ROLE_OPERATOR">ROLE_OPERATOR</option>
              </select>
            </FormGroup>

            <ButtonGroup style={{ marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setShowCreateRoleModal(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={handleCreateRole}>
                생성
              </Button>
            </ButtonGroup>
          </Card>
        </div>
      )}

      {/* 권한 업데이트 모달 */}
      {showUpdateRoleModal && updatingRole && (
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
          onClick={() => setShowUpdateRoleModal(false)}
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
              <CardTitle>권한 수정</CardTitle>
              <CardDescription>{updatingRole.roleKey} 권한을 수정합니다</CardDescription>
            </CardHeader>

            <FormGroup>
              <Label>권한 이름</Label>
              <select
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  width: '100%',
                }}
              >
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_INFLUENCER">ROLE_INFLUENCER</option>
                <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                <option value="ROLE_OPERATOR">ROLE_OPERATOR</option>
              </select>
            </FormGroup>

            <ButtonGroup style={{ marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setShowUpdateRoleModal(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={handleUpdateRole}>
                수정
              </Button>
            </ButtonGroup>
          </Card>
        </div>
      )}
    </div>
  );

  // 신고 내용 렌더링
  const renderDeclarationsContent = () => (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>🚨 신고 목록</CardTitle>
          <CardDescription>
            {declarationTotalElements > 0
              ? `전체 ${declarationTotalElements}개 신고 중 ${declarationPage + 1} / ${declarationTotalPages} 페이지`
              : '신고 내역이 없습니다'}
          </CardDescription>
        </CardHeader>

        {isLoading && declarations.length === 0 ? (
          <LoadingContainer>
            <p>신고 목록을 불러오는 중...</p>
          </LoadingContainer>
        ) : declarations.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>신고 내역이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>신고자</TableHeaderCell>
                  <TableHeaderCell>피신고자</TableHeaderCell>
                  <TableHeaderCell>사유</TableHeaderCell>
                  <TableHeaderCell>신고일</TableHeaderCell>
                  <TableHeaderCell>수정일</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {declarations.map((declaration, index) => (
                  <TableRow key={index}>
                    <TableCell>{declaration.fromMember}</TableCell>
                    <TableCell>{declaration.toMember}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                        }}
                      >
                        {declaration.reason}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(declaration.createdAt)}</TableCell>
                    <TableCell>{formatDate(declaration.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>

            {/* 페이지네이션 */}
            {declarationTotalPages > 1 && (
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
                  onClick={() => fetchDeclarations(declarationPage - 1)}
                  disabled={declarationPage === 0}
                  variant="secondary"
                >
                  이전
                </Button>
                <span style={{ color: '#888' }}>
                  {declarationPage + 1} / {declarationTotalPages}
                </span>
                <Button
                  onClick={() => fetchDeclarations(declarationPage + 1)}
                  disabled={declarationPage === declarationTotalPages - 1}
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
        <TabButton active={activeSubTab === 'roles'} onClick={() => setActiveSubTab('roles')}>
          <span>🔑</span>
          <span>권한 관리</span>
        </TabButton>
        <TabButton
          active={activeSubTab === 'declarations'}
          onClick={() => setActiveSubTab('declarations')}
        >
          <span>🚨</span>
          <span>신고 관리</span>
        </TabButton>
      </TabNav>

      {activeSubTab === 'roles' ? renderRolesContent() : renderDeclarationsContent()}
    </div>
  );
};

export default UserManagement;
