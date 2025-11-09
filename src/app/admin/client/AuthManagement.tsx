'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalAlert } from '@/providers/AlertProvider';
import { clientRequest } from '@/server/fetch/client';
import { clientEnv } from '@/utils/env';
import { RoleInfo } from '../types';
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

const AuthManagement: React.FC = () => {
  const { showSuccess, showError, showWarning } = useGlobalAlert();

  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [userSearchId, setUserSearchId] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<any>(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await clientRequest.get<RoleInfo[]>(
        `/role`
      );

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

  const handleSearchUser = async () => {
    if (!userSearchId || userSearchId.trim() === '') {
      showWarning('사용자 ID를 입력해주세요');
      return;
    }

    try {
      const response = await clientRequest.get(
        `/user/${userSearchId}`
      );

      if (response.success && response.data) {
        setSearchedUser(response.data);
        setSelectedUserId(userSearchId);
      } else {
        showError('사용자를 찾을 수 없습니다');
        setSearchedUser(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showError('사용자 검색에 실패했습니다');
      setSearchedUser(null);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUserId || !selectedRole) {
      showWarning('사용자 ID와 권한을 모두 선택해주세요');
      return;
    }

    if (!confirm(`사용자 ${selectedUserId}의 권한을 ${selectedRole}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const response = await clientRequest.patch(
        `/user/update/role`,
        {
          userId: parseInt(selectedUserId),
          role: selectedRole,
        }
      );

      if (response.success) {
        showSuccess('권한이 변경되었습니다');
        setSelectedUserId('');
        setSelectedRole('');
        setSearchedUser(null);
        setUserSearchId('');
      } else {
        showError('권한 변경에 실패했습니다');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      showError('권한 변경에 실패했습니다');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      showWarning('삭제할 사용자 ID를 입력해주세요');
      return;
    }

    if (!confirm(`사용자 ${selectedUserId}를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      const response = await clientRequest.post(
        `/user/delete`,
        {
          userId: parseInt(selectedUserId),
        }
      );

      if (response.success) {
        showSuccess('사용자가 삭제되었습니다');
        setSelectedUserId('');
        setSearchedUser(null);
        setUserSearchId('');
      } else {
        showError('사용자 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showError('사용자 삭제에 실패했습니다');
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <p>권한 정보를 불러오는 중...</p>
      </LoadingContainer>
    );
  }

  return (
    <div>
      <CardGrid>
        <Card>
          <CardHeader>
            <CardTitle>🔐 전체 권한</CardTitle>
          </CardHeader>
          <CardValue>{roles.length}</CardValue>
          <CardDescription>등록된 권한 수</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👤 사용자 조회</CardTitle>
          </CardHeader>
          <CardValue>{searchedUser ? '✓' : '-'}</CardValue>
          <CardDescription>
            {searchedUser ? `${searchedUser.nickname}` : '검색된 사용자 없음'}
          </CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ 권한 관리</CardTitle>
          </CardHeader>
          <CardValue style={{ fontSize: '1.5rem' }}>MANAGER</CardValue>
          <CardDescription>권한 필요: MANAGER 이상</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🗑️ 사용자 삭제</CardTitle>
          </CardHeader>
          <CardValue style={{ fontSize: '1.5rem' }}>OPERATOR</CardValue>
          <CardDescription>권한 필요: OPERATOR 이상</CardDescription>
        </Card>
      </CardGrid>

      <Card style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <CardHeader>
          <CardTitle>👤 사용자 검색 및 관리</CardTitle>
          <CardDescription>
            사용자 ID로 검색하여 권한을 변경하거나 삭제할 수 있습니다
          </CardDescription>
        </CardHeader>

        <FormGroup>
          <Label>사용자 ID</Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <InputForm
              type="number"
              value={userSearchId}
              onChange={(e) => setUserSearchId(e.target.value)}
              placeholder="사용자 ID를 입력하세요"
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearchUser}>🔍 검색</Button>
          </div>
        </FormGroup>

        {searchedUser && (
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem',
            }}
          >
            <h4 style={{ marginBottom: '0.5rem', color: '#3b82f6' }}>
              사용자 정보
            </h4>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>ID:</strong> {searchedUser.id}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>닉네임:</strong> {searchedUser.nickname}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>이메일:</strong> {searchedUser.email}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>현재 권한:</strong>{' '}
              <StatusBadge status="info">{searchedUser.role}</StatusBadge>
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>활성 상태:</strong>{' '}
              <StatusBadge status={searchedUser.isActive ? 'success' : 'error'}>
                {searchedUser.isActive ? '활성' : '비활성'}
              </StatusBadge>
            </p>
          </div>
        )}

        <FormGroup style={{ marginTop: '1rem' }}>
          <Label>권한 선택</Label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
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
            <option value="">권한을 선택하세요</option>
            {roles.map((role) => (
              <option key={role.id} value={role.roleKey}>
                {role.roleName} ({role.roleKey})
              </option>
            ))}
          </select>
        </FormGroup>

        <ButtonGroup style={{ marginTop: '1rem' }}>
          <Button onClick={handleUpdateRole} disabled={!searchedUser || !selectedRole}>
            ✏️ 권한 변경
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={!searchedUser}>
            🗑️ 사용자 삭제
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchedUser(null);
              setUserSearchId('');
              setSelectedUserId('');
              setSelectedRole('');
            }}
          >
            🔄 초기화
          </Button>
        </ButtonGroup>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔐 권한 목록</CardTitle>
          <CardDescription>시스템에 등록된 모든 권한</CardDescription>
        </CardHeader>

        {roles.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📭</EmptyIcon>
            <EmptyText>권한이 없습니다</EmptyText>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>권한 키</TableHeaderCell>
                <TableHeaderCell>권한 이름</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>
                    <StatusBadge status="info">{role.roleKey}</StatusBadge>
                  </TableCell>
                  <TableCell>{role.roleName}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AuthManagement;
