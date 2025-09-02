'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { palette } from '@/styles/palette';

interface TermsAgreementProps {
  onAgreementChange: (agreed: boolean) => void;
}

const TermsAgreement: React.FC<TermsAgreementProps> = ({
  onAgreementChange,
}) => {
  const [allAgreed, setAllAgreed] = useState(false);
  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleAllAgreement = (checked: boolean) => {
    setAllAgreed(checked);
    setServiceTerms(checked);
    setPrivacyPolicy(checked);
    setMarketingConsent(checked);
    onAgreementChange(checked);
  };

  const handleIndividualAgreement = (type: string, checked: boolean) => {
    switch (type) {
      case 'service':
        setServiceTerms(checked);
        break;
      case 'privacy':
        setPrivacyPolicy(checked);
        break;
      case 'marketing':
        setMarketingConsent(checked);
        break;
    }

    // 필수 약관들이 모두 동의되었는지 확인
    const updatedServiceTerms = type === 'service' ? checked : serviceTerms;
    const updatedPrivacyPolicy = type === 'privacy' ? checked : privacyPolicy;
    const updatedMarketingConsent =
      type === 'marketing' ? checked : marketingConsent;

    const requiredAgreed = updatedServiceTerms && updatedPrivacyPolicy;
    const allItemsAgreed = requiredAgreed && updatedMarketingConsent;

    setAllAgreed(allItemsAgreed);
    onAgreementChange(requiredAgreed);
  };

  return (
    <Container>
      <AgreementItem>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="all-terms"
            checked={allAgreed}
            onChange={(e) => handleAllAgreement(e.target.checked)}
          />
          <CheckboxLabel htmlFor="all-terms" $isMain>
            전체 약관에 동의합니다
          </CheckboxLabel>
        </CheckboxContainer>
      </AgreementItem>

      <Divider />

      <AgreementItem>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="service-terms"
            checked={serviceTerms}
            onChange={(e) =>
              handleIndividualAgreement('service', e.target.checked)
            }
          />
          <CheckboxLabel htmlFor="service-terms">
            <RequiredBadge>필수</RequiredBadge>
            서비스 이용약관 동의
          </CheckboxLabel>
        </CheckboxContainer>
        <ViewButton onClick={() => window.open('/terms-of-service', '_blank')}>
          보기
        </ViewButton>
      </AgreementItem>

      <AgreementItem>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="privacy-policy"
            checked={privacyPolicy}
            onChange={(e) =>
              handleIndividualAgreement('privacy', e.target.checked)
            }
          />
          <CheckboxLabel htmlFor="privacy-policy">
            <RequiredBadge>필수</RequiredBadge>
            개인정보 처리방침 동의
          </CheckboxLabel>
        </CheckboxContainer>
        <ViewButton onClick={() => window.open('/privacy-policy', '_blank')}>
          보기
        </ViewButton>
      </AgreementItem>

      <AgreementItem>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            id="marketing-consent"
            checked={marketingConsent}
            onChange={(e) =>
              handleIndividualAgreement('marketing', e.target.checked)
            }
          />
          <CheckboxLabel htmlFor="marketing-consent">
            <OptionalBadge>선택</OptionalBadge>
            마케팅 정보 수신 동의
          </CheckboxLabel>
        </CheckboxContainer>
      </AgreementItem>

      <Notice>
        * 필수 약관에 동의하지 않으면 서비스 이용이 제한될 수 있습니다.
      </Notice>
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5rem 0;
`;

const AgreementItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${palette.borderSoft};

  &:last-of-type {
    border-bottom: none;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${palette.accent};
  cursor: pointer;
`;

const CheckboxLabel = styled.label<{ $isMain?: boolean }>`
  color: ${(props) =>
    props.$isMain ? palette.textPrimary : palette.textSecondary};
  font-size: ${(props) => (props.$isMain ? '1rem' : '0.9rem')};
  font-weight: ${(props) => (props.$isMain ? '600' : '400')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RequiredBadge = styled.span`
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const OptionalBadge = styled.span`
  background: ${palette.textSecondary};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ViewButton = styled.button`
  background: none;
  border: 1px solid ${palette.border};
  color: ${palette.textSecondary};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${palette.accent};
    color: ${palette.accent};
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${palette.border};
  margin: 0.5rem 0;
`;

const Notice = styled.p`
  color: ${palette.textMuted};
  font-size: 0.8rem;
  margin: 1rem 0 0 0;
  line-height: 1.4;
`;

export default TermsAgreement;
