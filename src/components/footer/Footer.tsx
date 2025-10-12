'use client';

import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterMainSection,
  FooterLinksSection,
  FooterSection,
  FooterTitle,
  FooterCompanyTitle,
  FooterDescription,
  FooterList,
  FooterListItem,
  FooterLink,
  FooterEmail,
  FooterCopyright,
} from './style';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterMainSection>
          <FooterCompanyTitle>KimpRun</FooterCompanyTitle>
          <FooterDescription>
            암호화폐 김치프리미엄 실시간 모니터링 서비스
          </FooterDescription>
          <FooterEmail href="mailto:kimprun66@gmail.com">
            kimprun66@gmail.com
          </FooterEmail>
        </FooterMainSection>

        <FooterLinksSection>
          <FooterSection>
            <FooterTitle>법적 고지</FooterTitle>
            <FooterList>
              <FooterListItem>
                <FooterLink href="/privacy-policy">개인정보처리방침</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink href="/terms-of-service">서비스이용약관</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink href="/disclaimer">면책사항</FooterLink>
              </FooterListItem>
            </FooterList>
          </FooterSection>

          <FooterSection>
            <FooterTitle>지원</FooterTitle>
            <FooterList>
              <FooterListItem>
                <FooterLink href="/faq">FAQ</FooterLink>
              </FooterListItem>
              <FooterListItem>
                <FooterLink href="mailto:kimprun66@gmail.com">
                  문의하기
                </FooterLink>
              </FooterListItem>
            </FooterList>
          </FooterSection>
        </FooterLinksSection>
      </FooterContent>

      <FooterCopyright>
        © {currentYear} KimpRun. 투자 참고용 정보 서비스입니다.
      </FooterCopyright>
    </FooterContainer>
  );
};

export default Footer;
