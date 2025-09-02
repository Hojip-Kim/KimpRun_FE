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

const TermsOfServicePage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>서비스 이용약관</Title>
        <Subtitle>김프런 서비스 이용에 관한 약관</Subtitle>
        <Divider />
      </Header>

      <ContentGrid>
        <Section>
          <SectionTitle>목적</SectionTitle>
          <Paragraph>
            이 약관은 김프런(KimpRun)(이하 "회사")이 제공하는 암호화폐
            김치프리미엄 정보 서비스 (이하 "서비스")의 이용과 관련하여 회사와
            이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
            목적으로 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제2조 (정의)</SectionTitle>
          <List>
            <ListItem>
              "서비스"란 회사가 제공하는 암호화폐 거래소 간 가격 차이 정보 및
              관련 부가서비스를 의미합니다.
            </ListItem>
            <ListItem>
              "이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및
              비회원을 말합니다.
            </ListItem>
            <ListItem>
              "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의
              정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로
              이용할 수 있는 자를 말합니다.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제3조 (약관의 명시와 설명 및 개정)</SectionTitle>
          <Paragraph>
            회사는 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지
            주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호,
            전자우편주소, 사업자등록번호 등을 이용자가 쉽게 알 수 있도록 서비스
            초기 화면에 게시하거나 기타의 방법으로 이용자에게 공지합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제4조 (서비스의 제공 및 변경)</SectionTitle>
          <Paragraph>회사가 제공하는 서비스는 다음과 같습니다.</Paragraph>
          <List>
            <ListItem>암호화폐 거래소별 실시간 가격 정보 제공</ListItem>
            <ListItem>김치프리미엄 계산 및 표시</ListItem>
            <ListItem>거래소 간 차익거래 기회 정보 제공</ListItem>
            <ListItem>암호화폐 관련 뉴스 및 정보</ListItem>
            <ListItem>커뮤니티 서비스</ListItem>
            <ListItem>기타 회사가 정하는 서비스</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제5조 (서비스의 중단)</SectionTitle>
          <Paragraph>
            회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절
            등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수
            있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제6조 (회원가입)</SectionTitle>
          <Paragraph>
            이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에
            동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
          </Paragraph>
          <Paragraph>
            회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각
            호에 해당하지 않는 한 회원으로 등록합니다.
          </Paragraph>
          <List>
            <ListItem>
              가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는
              경우
            </ListItem>
            <ListItem>등록 내용에 허위, 기재누락, 오기가 있는 경우</ListItem>
            <ListItem>
              기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고
              판단되는 경우
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제7조 (이용자의 의무)</SectionTitle>
          <Paragraph>이용자는 다음 행위를 하여서는 안 됩니다.</Paragraph>
          <List>
            <ListItem>신청 또는 변경시 허위 내용의 등록</ListItem>
            <ListItem>타인의 정보 도용</ListItem>
            <ListItem>회사가 게시한 정보의 변경</ListItem>
            <ListItem>
              회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는
              게시
            </ListItem>
            <ListItem>
              회사 기타 제3자의 저작권 등 지적재산권에 대한 침해
            </ListItem>
            <ListItem>
              회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
            </ListItem>
            <ListItem>
              외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는
              정보를 회사에 공개 또는 게시하는 행위
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제8조 (저작권의 귀속 및 이용제한)</SectionTitle>
          <Paragraph>
            회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에
            귀속합니다.
          </Paragraph>
          <Paragraph>
            이용자는 회사를 이용함으로써 얻은 정보 중 회사에게 지적재산권이
            귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송
            기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게
            하여서는 안됩니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제9조 (면책조항)</SectionTitle>
          <Paragraph>
            회사가 제공하는 정보는 참고용이며, 투자 결정에 대한 책임은 전적으로
            이용자에게 있습니다.
          </Paragraph>
          <Paragraph>
            회사는 다음 각 호에 해당하는 경우에는 책임을 지지 않습니다.
          </Paragraph>
          <List>
            <ListItem>
              천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수
              없는 경우
            </ListItem>
            <ListItem>이용자의 귀책사유로 인한 서비스 이용의 장애</ListItem>
            <ListItem>
              이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것
            </ListItem>
            <ListItem>
              서비스에서 제공되는 정보를 이용한 투자 결정으로 인한 손실
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제10조 (분쟁해결)</SectionTitle>
          <Paragraph>
            회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를
            보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
          </Paragraph>
          <Paragraph>
            회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의
            이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는
            지방법원의 전속관할로 합니다.
          </Paragraph>
        </Section>
      </ContentGrid>

      <InfoCard>
        <InfoIcon>⚖️</InfoIcon>
        <InfoContent>
          <h4>분쟁 해결</h4>
          <p>
            서비스 이용 관련 분쟁이나 문의사항은 kimprun66@gmail.com으로
            연락주세요.
          </p>
        </InfoContent>
      </InfoCard>

      <Footer>
        <FooterText>
          <strong>시행일자:</strong> 2025년 9월 1일
          <br />본 약관은 관련 법령의 변경 또는 회사 정책에 따라 변경될 수
          있습니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default TermsOfServicePage;
