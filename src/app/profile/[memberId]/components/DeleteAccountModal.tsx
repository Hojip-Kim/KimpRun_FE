import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';
import { deleteMember } from '../api/profileApi';
import { useGlobalAlert } from '@/providers/AlertProvider';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'confirmation' | 'reason' | 'final';

interface WithdrawalReason {
  id: string;
  label: string;
}

const withdrawalReasons: WithdrawalReason[] = [
  { id: 'no_use', label: '더 이상 사용하지 않음' },
  { id: 'privacy', label: '개인정보 보호 우려' },
  { id: 'poor_service', label: '서비스 품질 불만' },
  { id: 'too_many_ads', label: '광고가 너무 많음' },
  { id: 'difficult_to_use', label: '사용이 어려움' },
  { id: 'other_service', label: '다른 서비스 이용' },
  { id: 'other', label: '기타' },
];

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
  
  @media (max-height: 700px) {
    align-items: flex-start;
    padding-top: 2rem;
  }
`;

const Modal = styled.div`
  background: ${palette.card};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid ${palette.border};
  margin: auto;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
    max-height: calc(100vh - 1rem);
  }

  @media (max-height: 600px) {
    max-height: calc(100vh - 1rem);
    padding: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${palette.textPrimary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${palette.textMuted};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${palette.input};
    color: ${palette.textPrimary};
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $active, $completed }) =>
    $completed ? palette.accent : $active ? palette.accent : palette.border};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: ${({ $active, $completed }) =>
    $active || $completed ? 'scale(1.2)' : 'scale(1)'};
  box-shadow: ${({ $active, $completed }) =>
    $active || $completed ? `0 0 0 3px ${palette.accentRing}` : 'none'};
`;

const ModalContent = styled.div`
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  min-height: 350px;
  padding: 0 0.25rem;

  @media (max-width: 768px) {
    min-height: 400px;
    padding: 0 0.5rem;
  }
`;

const StepContainer = styled.div<{ $currentStep: number }>`
  display: flex;
  width: 300%;
  transform: translateX(${({ $currentStep }) => -$currentStep * 33.333}%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const StepContent = styled.div`
  width: 33.333%;
  flex-shrink: 0;
  padding: 0 0.5rem;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`;

const WarningBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const WarningTitle = styled.h3`
  color: #ef4444;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const WarningText = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ReasonItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${palette.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${palette.input};
    border-color: ${palette.accent};
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${palette.accent};
`;

const ReasonLabel = styled.span`
  color: ${palette.textPrimary};
  font-size: 0.9rem;
`;

const InfoBox = styled.div`
  background: ${palette.input};
  border: 1px solid ${palette.border};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoTitle = styled.h3`
  color: ${palette.accent};
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const InfoText = styled.p`
  color: ${palette.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;

  ${({ $variant }) => {
    if ($variant === 'danger') {
      return `
        background: #ef4444;
        color: white;
        border-color: #ef4444;

        &:hover {
          background: #dc2626;
          border-color: #dc2626;
        }
      `;
    } else if ($variant === 'primary') {
      return `
        background: ${palette.accent};
        color: ${palette.bgPage};
        border-color: ${palette.accent};

        &:hover {
          background: ${palette.accent};
          border-color: ${palette.accent};
          opacity: 0.9;
        }
      `;
    } else {
      return `
        background: transparent;
        color: ${palette.textSecondary};
        border-color: ${palette.border};

        &:hover {
          background: ${palette.input};
          color: ${palette.textPrimary};
        }
      `;
    }
  }}
`;

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('confirmation');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const { showSuccess, showError } = useGlobalAlert();

  const handleReasonChange = (reasonId: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reasonId)
        ? prev.filter((id) => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleNext = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('reason');
    } else if (currentStep === 'reason') {
      setCurrentStep('final');
    }
  };

  const handleBack = () => {
    if (currentStep === 'reason') {
      setCurrentStep('confirmation');
    } else if (currentStep === 'final') {
      setCurrentStep('reason');
    }
  };

  const handleDelete = async () => {
    const isDeleted = await deleteMember(selectedReasons[0]);
    if (isDeleted) {
      showSuccess('회원탈퇴가 처리되었습니다.');
      onClose();
    } else {
      showError('회원탈퇴 처리에 실패했습니다.');
    }

    showSuccess('회원탈퇴가 처리되었습니다. (API 미구현)');
    onClose();
  };

  const handleClose = () => {
    setCurrentStep('confirmation');
    setSelectedReasons([]);
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'confirmation':
        return '회원탈퇴 확인';
      case 'reason':
        return '탈퇴 이유';
      case 'final':
        return '최종 확인';
      default:
        return '';
    }
  };

  const getStepIndex = (step: Step): number => {
    switch (step) {
      case 'confirmation':
        return 0;
      case 'reason':
        return 1;
      case 'final':
        return 2;
      default:
        return 0;
    }
  };

  const renderConfirmationStep = () => (
    <StepContent>
      <WarningBox>
        <WarningTitle>⚠️ 회원탈퇴 안내</WarningTitle>
        <WarningText>
          회원탈퇴를 진행하시겠습니까? 탈퇴 후에는 작성하신 게시물과 댓글이 모두
          삭제되며, 이는 복구할 수 없습니다.
        </WarningText>
      </WarningBox>
      <InfoBox>
        <InfoTitle>📝 탈퇴 전 확인사항</InfoTitle>
        <InfoText>
          • 작성한 모든 게시물과 댓글이 삭제됩니다
          <br />
          • 팔로우/팔로워 관계가 모두 해제됩니다
          <br />
          • 프로필 정보가 완전히 삭제됩니다
          <br />• 탈퇴 후 30일 간 계정 복구가 가능합니다
        </InfoText>
      </InfoBox>
    </StepContent>
  );

  const renderReasonStep = () => (
    <StepContent>
      <WarningText style={{ marginBottom: '1.5rem' }}>
        탈퇴하시는 이유를 선택해주세요. (복수 선택 가능)
      </WarningText>
      <ReasonList>
        {withdrawalReasons.map((reason) => (
          <ReasonItem key={reason.id}>
            <Checkbox
              type="checkbox"
              checked={selectedReasons.includes(reason.id)}
              onChange={() => handleReasonChange(reason.id)}
            />
            <ReasonLabel>{reason.label}</ReasonLabel>
          </ReasonItem>
        ))}
      </ReasonList>
    </StepContent>
  );

  const renderFinalStep = () => (
    <StepContent>
      <WarningBox>
        <WarningTitle>🔄 계정 복구 안내</WarningTitle>
        <WarningText>
          탈퇴 후 30일 이내에 다시 로그인하시면 계정을 복구할 수 있습니다.
          30일이 지나면 모든 데이터가 영구적으로 삭제됩니다.
        </WarningText>
      </WarningBox>
      <InfoBox>
        <InfoTitle>📋 선택하신 탈퇴 이유</InfoTitle>
        <InfoText>
          {selectedReasons.length > 0
            ? selectedReasons
                .map((id) => withdrawalReasons.find((r) => r.id === id)?.label)
                .join(', ')
            : '선택된 이유가 없습니다'}
        </InfoText>
      </InfoBox>
      <WarningBox>
        <WarningTitle>⚠️ 최종 확인</WarningTitle>
        <WarningText>
          정말로 회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
        </WarningText>
      </WarningBox>
    </StepContent>
  );

  if (!isOpen) return null;

  return (
    <Overlay $isOpen={isOpen} onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{getStepTitle()}</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <StepIndicator>
          <StepDot
            $active={currentStep === 'confirmation'}
            $completed={currentStep !== 'confirmation'}
          />
          <StepDot
            $active={currentStep === 'reason'}
            $completed={currentStep === 'final'}
          />
          <StepDot $active={currentStep === 'final'} $completed={false} />
        </StepIndicator>

        <ModalContent>
          <StepContainer $currentStep={getStepIndex(currentStep)}>
            {renderConfirmationStep()}
            {renderReasonStep()}
            {renderFinalStep()}
          </StepContainer>
        </ModalContent>

        <ButtonGroup>
          {currentStep !== 'confirmation' && (
            <Button onClick={handleBack}>이전</Button>
          )}
          <Button onClick={handleClose}>취소</Button>
          {currentStep === 'final' ? (
            <Button $variant="danger" onClick={handleDelete}>
              회원탈퇴
            </Button>
          ) : (
            <Button $variant="primary" onClick={handleNext}>
              다음
            </Button>
          )}
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
}
