'use client';

import React from 'react';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Divider,
  ContentGrid,
  Section,
  SectionTitle,
  Paragraph,
  List,
  ListItem,
  InfoCard,
  InfoIcon,
  InfoContent,
  Footer,
  FooterText,
} from '@/components/legal-pages/SharedStyles';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>개인정보 처리방침</Title>
        <Subtitle>개인정보 보호 및 처리에 관한 정책</Subtitle>
        <Divider />
      </Header>

      <Paragraph>
        김프런(KimpRun)(이하 "회사")은 개인정보보호법에 따라 이용자의 개인정보
        보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게
        처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
      </Paragraph>

      <ContentGrid>
        <Section>
          <SectionTitle>개인정보의 처리목적</SectionTitle>
          <Paragraph>
            회사는 다음의 목적을 위하여 개인정보를 처리합니다.
          </Paragraph>
          <List>
            <ListItem>서비스 제공 및 계약 이행</ListItem>
            <ListItem>회원 관리 및 본인확인</ListItem>
            <ListItem>고객 상담 및 불만 처리</ListItem>
            <ListItem>서비스 개선 및 신규 서비스 개발</ListItem>
            <ListItem>법적 의무 이행</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보의 처리 및 보유기간</SectionTitle>
          <Paragraph>
            회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
            개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
            개인정보를 처리·보유합니다.
          </Paragraph>
          <List>
            <ListItem>회원가입정보: 회원탈퇴시까지</ListItem>
            <ListItem>서비스 이용기록: 3년</ListItem>
            <ListItem>불만 또는 분쟁 처리기록: 3년</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보의 제3자 제공</SectionTitle>
          <Paragraph>
            회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 단,
            다음의 경우에는 예외로 합니다.
          </Paragraph>
          <List>
            <ListItem>이용자가 사전에 동의한 경우</ListItem>
            <ListItem>법령의 규정에 의한 경우</ListItem>
            <ListItem>수사기관의 요구가 있는 경우</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보 처리의 위탁</SectionTitle>
          <Paragraph>
            회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
            처리업무를 위탁하고 있습니다.
          </Paragraph>
          <List>
            <ListItem>클라우드 서비스 제공업체: 데이터 저장 및 백업</ListItem>
            <ListItem>이메일 발송 업체: 회원 공지사항 발송</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>정보주체의 권리·의무</SectionTitle>
          <Paragraph>
            이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>개인정보 처리현황 통지요구</ListItem>
            <ListItem>개인정보 열람요구</ListItem>
            <ListItem>개인정보 정정·삭제요구</ListItem>
            <ListItem>개인정보 처리정지 요구</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보의 안전성 확보조치</SectionTitle>
          <Paragraph>
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
            있습니다.
          </Paragraph>
          <List>
            <ListItem>
              관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육
            </ListItem>
            <ListItem>
              기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템
              설치
            </ListItem>
            <ListItem>물리적 조치: 전산실, 자료보관실 등의 접근통제</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보보호 책임자</SectionTitle>
          <Paragraph>
            개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
            관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이
            개인정보보호 책임자를 지정하고 있습니다.
          </Paragraph>
          <List>
            <ListItem>개인정보보호 책임자: 김프런 관리팀</ListItem>
            <ListItem>연락처: kimprun66@gmail.com</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인정보 처리방침 변경</SectionTitle>
          <Paragraph>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
            변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일
            전부터 공지사항을 통하여 고지할 것입니다.
          </Paragraph>
        </Section>
      </ContentGrid>

      <InfoCard>
        <InfoIcon>🛡️</InfoIcon>
        <InfoContent>
          <h4>개인정보보호 책임자</h4>
          <p>개인정보 처리 관련 문의는 kimprun66@gmail.com으로 연락주세요.</p>
        </InfoContent>
      </InfoCard>

      <Footer>
        <FooterText>
          <strong>시행일자:</strong> 2025년 9월 1일
          <br />
          개인정보처리방침 변경 시 웹사이트 공지사항을 통하여 공지할 것입니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default PrivacyPolicyPage;
