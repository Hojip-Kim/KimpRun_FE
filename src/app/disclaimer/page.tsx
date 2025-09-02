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
  HighlightBox,
  HighlightTitle,
  HighlightText,
  List,
  ListItem,
  InfoCard,
  InfoIcon,
  InfoContent,
  Footer,
  FooterText,
} from '@/components/legal-pages/SharedStyles';

const DisclaimerPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>면책사항</Title>
        <Subtitle>투자 위험 고지 및 서비스 이용 제한사항</Subtitle>
        <Divider />
      </Header>

      <HighlightBox>
        <HighlightTitle>⚠️ 중요한 알림</HighlightTitle>
        <HighlightText>
          김프런(KimpRun)이 제공하는 모든 정보는 투자 참고용이며, 투자 권유나
          투자 조언이 아닙니다. 투자 결정에 따른 모든 책임은 투자자 본인에게
          있습니다.
        </HighlightText>
      </HighlightBox>

      <ContentGrid>
        <Section>
          <SectionTitle>정보의 성격</SectionTitle>
          <Paragraph>
            김프런(KimpRun)에서 제공하는 암호화폐 가격 정보, 김치프리미엄 정보,
            차익거래 기회 정보 등은 단순한 정보 제공 목적으로만 사용되어야
            합니다.
          </Paragraph>
          <List>
            <ListItem>
              제공되는 정보는 투자 권유나 투자 조언이 아닙니다
            </ListItem>
            <ListItem>
              정보는 참고용이며 투자 결정의 유일한 근거가 되어서는 안 됩니다
            </ListItem>
            <ListItem>
              모든 투자 결정은 투자자 본인의 판단과 책임 하에 이루어져야 합니다
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>데이터 정확성 및 지연</SectionTitle>
          <Paragraph>
            회사는 정확한 정보 제공을 위해 노력하고 있으나, 다음과 같은 한계가
            있습니다.
          </Paragraph>
          <List>
            <ListItem>실시간 데이터에 지연이 발생할 수 있습니다</ListItem>
            <ListItem>
              거래소별 데이터 수집 과정에서 일시적 오류가 발생할 수 있습니다
            </ListItem>
            <ListItem>
              네트워크 상황에 따라 데이터 업데이트가 지연될 수 있습니다
            </ListItem>
            <ListItem>
              제3자 API 서비스 중단으로 인한 데이터 누락이 발생할 수 있습니다
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>투자 위험 고지</SectionTitle>
          <HighlightBox>
            <HighlightTitle>🚨 위험 경고</HighlightTitle>
            <HighlightText>
              암호화폐 투자는 다음과 같은 높은 위험을 수반합니다
            </HighlightText>
          </HighlightBox>
          <List>
            <ListItem>
              <strong>가격 변동성:</strong> 암호화폐는 극심한 가격 변동성을
              가지고 있어 투자 원금 손실 위험이 큽니다
            </ListItem>
            <ListItem>
              <strong>규제 위험:</strong> 정부의 규제 변화로 인한 시장 충격이
              발생할 수 있습니다
            </ListItem>
            <ListItem>
              <strong>기술적 위험:</strong> 블록체인 기술의 결함이나 해킹 위험이
              존재합니다
            </ListItem>
            <ListItem>
              <strong>유동성 위험:</strong> 특정 상황에서 거래가 어려울 수
              있습니다
            </ListItem>
            <ListItem>
              <strong>거래소 위험:</strong> 거래소 파산이나 서비스 중단 위험이
              있습니다
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>차익거래 관련 주의사항</SectionTitle>
          <Paragraph>
            김치프리미엄을 활용한 차익거래 시 다음 사항을 반드시 고려하시기
            바랍니다.
          </Paragraph>
          <List>
            <ListItem>거래소 간 송금 시간으로 인한 가격 변동 위험</ListItem>
            <ListItem>거래소별 수수료 및 네트워크 수수료</ListItem>
            <ListItem>거래소별 입출금 제한 및 KYC 요구사항</ListItem>
            <ListItem>세법상 과세 대상이 될 수 있음</ListItem>
            <ListItem>대량 거래 시 시장 영향(슬리피지) 발생 가능</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>서비스 이용 제한</SectionTitle>
          <Paragraph>
            다음과 같은 경우 서비스 이용이 제한될 수 있습니다.
          </Paragraph>
          <List>
            <ListItem>시스템 점검 및 업그레이드</ListItem>
            <ListItem>외부 API 서비스 중단</ListItem>
            <ListItem>네트워크 장애</ListItem>
            <ListItem>천재지변 및 불가항력적 사유</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>법적 책임의 제한</SectionTitle>
          <Paragraph>
            회사는 다음과 같은 경우에 대해 법적 책임을 지지 않습니다.
          </Paragraph>
          <List>
            <ListItem>서비스 이용으로 인한 투자 손실</ListItem>
            <ListItem>데이터 지연이나 오류로 인한 손해</ListItem>
            <ListItem>제3자 서비스 중단으로 인한 불편</ListItem>
            <ListItem>사용자의 잘못된 판단으로 인한 손실</ListItem>
            <ListItem>불가항력적 사유로 인한 서비스 중단</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>개인 책임</SectionTitle>
          <Paragraph>
            모든 사용자는 다음과 같은 개인 책임을 져야 합니다.
          </Paragraph>
          <List>
            <ListItem>투자 전 충분한 조사와 검토</ListItem>
            <ListItem>개인의 위험 감수 능력 내에서의 투자</ListItem>
            <ListItem>관련 법규 및 세법 준수</ListItem>
            <ListItem>투자 결정에 대한 전적인 책임</ListItem>
          </List>
        </Section>
      </ContentGrid>

      <InfoCard>
        <InfoIcon>📧</InfoIcon>
        <InfoContent>
          <h4>문의사항이 있으신가요?</h4>
          <p>
            서비스 관련 문의사항은 kimprun66@gmail.com으로 연락주세요.
            (응답시간: 영업일 기준 1-2일)
          </p>
        </InfoContent>
      </InfoCard>

      <Footer>
        <FooterText>
          <strong>최종 업데이트:</strong> 2025년 9월 1일
          <br />본 면책사항은 사전 공지 없이 변경될 수 있으며, 변경된 내용은
          게시와 동시에 효력을 발생합니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default DisclaimerPage;
