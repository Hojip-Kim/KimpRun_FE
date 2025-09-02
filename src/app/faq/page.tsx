'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Divider,
  ContentGrid,
  InfoCard,
  InfoIcon,
  InfoContent,
  Footer,
  FooterText,
} from '@/components/legal-pages/SharedStyles';
import { palette } from '@/styles/palette';

const FAQItem = styled.div`
  border: 1px solid ${palette.border};
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  background: ${palette.card};
  box-shadow: ${palette.shadow};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
`;

const Question = styled.div<{ isOpen: boolean }>`
  background-color: ${(props) =>
    props.isOpen ? palette.bgContainer : palette.card};
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: ${palette.textPrimary};
  border-bottom: ${(props) =>
    props.isOpen ? `1px solid ${palette.border}` : 'none'};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${palette.bgContainer};
  }
`;

const Answer = styled.div<{ isOpen: boolean }>`
  max-height: ${(props) => (props.isOpen ? '500px' : '0')};
  overflow: hidden;
  padding: ${(props) => (props.isOpen ? '20px' : '0 20px')};
  background-color: ${palette.card};
  color: ${palette.textSecondary};
  line-height: 1.6;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  transform: translateY(${(props) => (props.isOpen ? '0' : '-10px')});
`;

const Icon = styled.span<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
  font-size: 20px;
  color: ${palette.accent};
`;

const Category = styled.h2`
  color: ${palette.accent};
  margin: 0 0 24px 0;
  padding: 16px 0;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${palette.accent};
    border-radius: 50%;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 20px 0;
    padding: 12px 0;

    &::before {
      width: 6px;
      height: 6px;
    }
  }
`;

interface FAQItemType {
  question: string;
  answer: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const generalFAQs: FAQItemType[] = [
    {
      question: '김프런(KimpRun)이 무엇인가요?',
      answer:
        '김프런은 국내외 암호화폐 거래소 간의 가격 차이(김치프리미엄)를 실시간으로 모니터링하고 차익거래 기회를 제공하는 정보 서비스입니다. 업비트, 바이낸스, 빗썸, 코인원 등 주요 거래소의 가격을 비교하여 투자자들이 더 나은 거래 결정을 내릴 수 있도록 도와드립니다.',
    },
    {
      question: '서비스 이용료가 있나요?',
      answer:
        '기본적인 가격 정보 조회 서비스는 무료로 제공됩니다. 다만, 향후 프리미엄 기능이나 고급 분석 도구 등은 유료로 제공될 수 있습니다. 모든 요금 정책 변경은 사전에 공지해드립니다.',
    },
    {
      question: '회원가입이 필요한가요?',
      answer:
        '기본적인 가격 정보는 비회원도 이용하실 수 있습니다. 하지만 개인화된 알림, 포트폴리오 추적, 커뮤니티 참여 등의 기능을 이용하시려면 회원가입이 필요합니다.',
    },
    {
      question: '모바일에서도 이용할 수 있나요?',
      answer:
        '네, 김프런은 반응형 웹 디자인으로 제작되어 PC, 태블릿, 스마트폰 등 모든 기기에서 최적화된 환경으로 이용하실 수 있습니다.',
    },
  ];

  const dataFAQs: FAQItemType[] = [
    {
      question: '데이터는 얼마나 정확한가요?',
      answer:
        '각 거래소의 공식 API를 통해 실시간 데이터를 수집하고 있습니다. 하지만 네트워크 상황이나 거래소 API 상태에 따라 1-2초의 지연이 발생할 수 있습니다. 중요한 거래 결정 시에는 반드시 해당 거래소에서 직접 확인하시기 바랍니다.',
    },
    {
      question: '김치프리미엄이 무엇인가요?',
      answer:
        '김치프리미엄은 국내 거래소의 암호화폐 가격이 해외 거래소보다 높게 형성되는 현상을 말합니다. 예를 들어, 비트코인이 바이낸스에서 50,000달러, 업비트에서 60,000,000원에 거래된다면, 원달러 환율을 고려했을 때의 가격 차이를 김치프리미엄으로 표시합니다.',
    },
    {
      question: '어떤 거래소의 데이터를 제공하나요?',
      answer:
        '현재 업비트(Upbit), 바이낸스(Binance), 빗썸(Bithumb), 코인원(Coinone) 등 주요 거래소의 데이터를 제공하고 있습니다. 지속적으로 더 많은 거래소를 추가할 예정입니다.',
    },
    {
      question: '데이터 업데이트 주기는 어떻게 되나요?',
      answer:
        '실시간으로 데이터를 업데이트하고 있으며, 평균적으로 1-3초마다 최신 가격 정보를 반영합니다. 거래소별로 API 제한이 있어 업데이트 주기가 약간씩 다를 수 있습니다.',
    },
  ];

  const tradingFAQs: FAQItemType[] = [
    {
      question: '차익거래는 어떻게 하나요?',
      answer:
        '차익거래는 높은 위험을 수반하므로 신중하게 접근하시기 바랍니다. 일반적으로는 가격이 낮은 거래소에서 구매하고 높은 거래소에서 판매하는 방식입니다. 하지만 송금 시간, 수수료, 슬리피지 등을 모두 고려해야 하며, 실제 수익 보장은 없습니다.',
    },
    {
      question: '거래 수수료는 어떻게 계산하나요?',
      answer:
        '각 거래소마다 거래 수수료, 입출금 수수료, 네트워크 수수료가 다릅니다. 차익거래 시에는 모든 수수료를 사전에 계산하여 실제 수익성을 판단하셔야 합니다. 김프런에서는 참고용 수수료 정보를 제공하지만, 정확한 수수료는 각 거래소에서 확인하시기 바랍니다.',
    },
    {
      question: '송금 시간은 얼마나 걸리나요?',
      answer:
        '암호화폐와 네트워크 상황에 따라 다르지만, 비트코인의 경우 10분-1시간, 이더리움의 경우 1-15분 정도 소요됩니다. 네트워크 혼잡 시에는 더 오래 걸릴 수 있으며, 이 시간 동안 가격 변동 위험이 있습니다.',
    },
    {
      question: '세금은 어떻게 처리하나요?',
      answer:
        '암호화폐 거래로 인한 수익은 세법상 기타소득 또는 양도소득으로 분류될 수 있습니다. 세금 처리에 대해서는 반드시 세무 전문가와 상담하시기 바라며, 관련 법규를 준수하시기 바랍니다.',
    },
  ];

  const technicalFAQs: FAQItemType[] = [
    {
      question: '로그인이 안 돼요.',
      answer:
        '브라우저 쿠키와 캐시를 삭제한 후 다시 시도해보세요. 그래도 문제가 지속되면 kimprun66@gmail.com으로 문의해주시기 바랍니다.',
    },
    {
      question: '가격이 업데이트되지 않아요.',
      answer:
        '페이지를 새로고침해보시고, 인터넷 연결 상태를 확인해주세요. 지속적인 문제 발생 시 시스템 점검 중일 수 있으니 잠시 후 다시 접속해보시기 바랍니다.',
    },
    {
      question: '어떤 브라우저를 지원하나요?',
      answer:
        'Chrome, Firefox, Safari, Edge 등 모든 최신 브라우저를 지원합니다. 최적의 이용 환경을 위해 최신 버전의 브라우저 사용을 권장합니다.',
    },
    {
      question: 'API 서비스도 제공하나요?',
      answer:
        '현재는 웹 서비스만 제공하고 있으며, API 서비스는 향후 제공 예정입니다. API 서비스 출시 시 별도 공지해드리겠습니다.',
    },
  ];

  const renderFAQSection = (faqs: FAQItemType[], startIndex: number) => {
    return faqs.map((faq, index) => {
      const globalIndex = startIndex + index;
      const isOpen = openItems.includes(globalIndex);

      return (
        <FAQItem key={globalIndex}>
          <Question isOpen={isOpen} onClick={() => toggleItem(globalIndex)}>
            <span>{faq.question}</span>
            <Icon isOpen={isOpen}>▼</Icon>
          </Question>
          <Answer isOpen={isOpen}>{faq.answer}</Answer>
        </FAQItem>
      );
    });
  };

  return (
    <Container>
      <Header>
        <Title>자주 묻는 질문</Title>
        <Subtitle>김프런 서비스 이용에 대한 궁금증을 해결해드립니다</Subtitle>
        <Divider />
      </Header>

      <ContentGrid>
        <div>
          <Category>서비스 일반</Category>
          {renderFAQSection(generalFAQs, 0)}
        </div>

        <div>
          <Category>데이터 및 정확성</Category>
          {renderFAQSection(dataFAQs, generalFAQs.length)}
        </div>

        <div>
          <Category>거래 관련</Category>
          {renderFAQSection(tradingFAQs, generalFAQs.length + dataFAQs.length)}
        </div>

        <div>
          <Category>기술적 문제</Category>
          {renderFAQSection(
            technicalFAQs,
            generalFAQs.length + dataFAQs.length + tradingFAQs.length
          )}
        </div>
      </ContentGrid>

      <InfoCard>
        <InfoIcon>💬</InfoIcon>
        <InfoContent>
          <h4>추가 문의사항이 있으신가요?</h4>
          <p>
            위 FAQ에서 답을 찾지 못하셨다면 kimprun66@gmail.com으로 언제든
            문의해주세요.
          </p>
        </InfoContent>
      </InfoCard>

      <Footer>
        <FooterText>
          더 나은 서비스를 위해 지속적으로 FAQ를 업데이트하고 있습니다.
          <br />
          문의사항은 평균 1-2일 내에 답변드립니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default FAQPage;
