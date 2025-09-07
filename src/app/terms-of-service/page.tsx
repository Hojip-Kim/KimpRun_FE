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
        <Subtitle>김프런팀이 운영하는 서비스 이용에 관한 약관</Subtitle>
        <Divider />
      </Header>

      <Section>
        <Paragraph>
          본 이용약관의 주요 내용은 김프런팀(이하 "팀"라 합니다)이 회원의 권익을 위하여, 『약관의 규제에 관한 법률』 상 의무를 이행하기 위하여 별도로 회원에게 고지하는 것입니다. 그러므로, 회원은 본 이용약관의 주요 내용을 반드시 확인하고, 본 이용약관의 주요 내용을 이해할 수 없거나 의문이 발생하는 경우에는 팀에게 별도로 문의하는 방법 등을 통하여 이용약관 전체를 숙지하여 주시기 바랍니다.
        </Paragraph>
        <Paragraph>
          본 약관은 개인 회원과 팀 사이의 기본적인 사항을 규정하기 위한 것입니다.
        </Paragraph>
        <Paragraph>
          만 19세 미만은 팀에서 제공하는 서비스 일부의 이용이 제한될 수 있습니다.
        </Paragraph>
        <Paragraph>
          접속자가 팀의 서비스를 이용하기 위하여 회원의 계정, 비밀번호 기타 회원이 팀에게 제공한 로그인 정보와 일치하는 정보를 기입하여 팀의 웹사이트를 이용하는 경우, 해당 접속 기간 중 이루어지는 모든 행위는 해당 회원의 진정한 의사에 기한 것으로 간주됩니다. 그러므로 회원은 계정, 비밀번호 기타 정보에 대한 보안을 각별히 유지하여야 하고, 범죄로 인한 피해를 주의하여야 합니다.
        </Paragraph>
        <Paragraph>
          팀은 365일, 24시간 서비스를 제공하기 위하여 노력하고 있으나, 이를 보증하는 것이 아닙니다. 회원 또는 제3자의 불법행위 등으로 인하여 서비스가 일시 중단되거나 서비스에 오류가 발생하는 등의 문제가 발생할 경우, 팀은 문제를 해결하고 서비스를 재개합니다.
        </Paragraph>
        <Paragraph>
          회원의 불법행위로 인하여, 팀에게 손해가 발생할 경우, 팀은 회원에게 법률상 손해배상청구권을 행사할 수 있습니다. 그러므로 반드시 법령을 준수하여 팀의 서비스를 이용하여 주시기 바랍니다.
        </Paragraph>
      </Section>

      <div style={{ marginTop: '3rem' }}></div>

      <ContentGrid>
        <Section>
          <SectionTitle>제1조 (목적)</SectionTitle>
          <Paragraph>
            이 정책은 팀이 제공하는 서비스와 관련된 팀과 회원의 권리, 의무 및 책임사항 등 필요한 사항을 규정하기 위함을 목적으로 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제2조 (약관의 명시, 설명과 개정)</SectionTitle>
          <Paragraph>
            1. 이 약관의 내용은 팀이 제공하는 "김프가" 웹사이트에 게시하거나 기타의 방법으로 사용자에게 공지하고, 이용자가 회원으로 가입하면서 이 약관에 동의하거나, 기존 회원이 이 약관에 동의하면서 서비스를 이용함으로써 효력을 발생합니다.
          </Paragraph>
          <Paragraph>
            2. 팀은 필요한 경우 관련 법령에 위배되지 않는 범위 내에서 이 약관의 내용을 변경할 수 있습니다. 이 약관이 변경되는 경우 팀은 변경사항을 개정 약관의 시행일자 7일 전부터 제1항의 방법으로 공지합니다. 다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제3조 (약관 외 준칙)</SectionTitle>
          <Paragraph>
            이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 『전자상거래 등에서의 소비자보호에 관한 법률』, 『약관의 규제에 관한 법률』, 공정거래위원회가 제정한 『전자상거래 등에서의 소비자보호지침』 및 관련 법령의 규정과 일반 상관례에 의합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제4조 (서비스의 제공 및 변경)</SectionTitle>
          <Paragraph>1. 팀은 다음과 같은 서비스를 제공할 수 있습니다.</Paragraph>
          <List>
            <ListItem>블록체인 기술 및 토큰의 시세정보 검색 서비스</ListItem>
            <ListItem>오픈 채팅 서비스 (이하 김프챗)</ListItem>
            <ListItem>기타 팀이 정하는 서비스</ListItem>
          </List>
          <Paragraph>
            2. 팀은 서비스의 종류에 따라 각 서비스의 특성, 절차 및 방법에 대한 사항을 서비스 화면을 통하여 공지하며, 회원은 팀이 공지한 각 서비스에 관한 사항을 이해하고 서비스를 이용하여야 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제5조 (서비스 이용의 개시 및 서비스 이용 제한)</SectionTitle>
          <Paragraph>
            1. 이용자는 팀이 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 하는 방식으로 회원가입을 신청하여 팀으로부터 승낙의 의사를 통지받거나, 서비스를 이용하기 전 본 약관에 동의함으로써, 회원의 자격으로 김프가 웹사이트가 제공하는 서비스를 자유롭게 이용할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제6조 (계정의 관리)</SectionTitle>
          <Paragraph>
            계정은 회원 본인만 이용할 수 있고, 어떠한 경우에도 다른 사람이 회원의 계정을 이용하도록 허락할 수 없습니다. 그리고 회원은 다른 사람이 회원의 계정을 무단으로 사용할 수 없도록 직접 비밀번호를 관리하여야 합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제7조 (서비스 이용방법 및 주의사항)</SectionTitle>
          <Paragraph>
            팀은 서비스 품질 향상을 위하여 회원에게 서비스 이용과 관련된 각종 고지, 관리 메시지 및 기타 광고를 비롯한 다양한 정보를 서비스에 표시하거나 회원의 전자우편 등으로 직접 발송할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제8조 (서비스의 이용, 변경 및 종료)</SectionTitle>
          <Paragraph>
            1. 팀은 서비스를 365일 24시간 제공하기 위하여 최선의 노력을 다합니다. 다만, 장비의 유지∙보수를 위한 정기∙임시점검 또는 다른 상당한 이유로 서비스의 제공이 일시 중단될 수 있고, 이 때에는 사전에 서비스 제공 화면에 공지합니다.
          </Paragraph>
          <Paragraph>
            2. 김프가의 차트 솔루션은 글로벌 커뮤니티를 위한 차트 플랫폼인 트레이딩뷰에서 제공합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제9조 (회원 탈퇴 및 자격상실에 따른 조치)</SectionTitle>
          <Paragraph>
            회원이 이용계약의 해지를 요청하거나 개인정보의 수집 및 이용에 대한 동의를 철회하는 경우, 30일의 유예기간 이후 해당 개인정보를 파기합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제10조 (저작권의 귀속 및 이용제한)</SectionTitle>
          <Paragraph>
            1. 팀이 작성한 저작물에 대한 저작권 기타 지적재산권은 팀에 귀속합니다.
          </Paragraph>
          <Paragraph>
            2. 회원은 웹사이트 등을 이용함으로써 얻은 정보 중 팀에게 지적재산권이 귀속된 정보를 팀의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제11조 (이용계약의 해지)</SectionTitle>
          <Paragraph>
            회원이 서비스의 이용을 원하지 아니하거나 이 약관에 동의하지 아니하는 경우, 회원은 언제든지 서비스 내 제공되는 메뉴 또는 고객센터를 이용하여 서비스 이용계약의 해지를 신청할 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제12조 (개인정보의 보호)</SectionTitle>
          <Paragraph>
            회원의 개인정보는 서비스의 원활한 제공을 위하여 회원이 동의한 목적과 범위 내에서만 이용됩니다. 팀은 법령에 의하거나 회원이 별도로 동의하지 아니하는 한, 회원의 개인정보를 제3자에게 제공하지 아니합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제13조 (팀의 책임)</SectionTitle>
          <Paragraph>
            1. 팀은 서비스 이용 과정에서 투자정보를 제외한 시스템 오류, 서버의 문제 등으로 생긴 문제에 대하여 책임을 집니다.
          </Paragraph>
          <Paragraph>
            2. 제1항에도 불구하고, 팀은 천재지변, 팀의 귀책사유가 없는 정전, 화재, 통신장애, 기타 불가항력적인 사유로 처리할 수 없거나 지연된 경우에는 이용자에 대하여 그 책임을 지지 않습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제14조 (분쟁의 해결)</SectionTitle>
          <Paragraph>
            본 약관 또는 서비스는 대한민국 법령에 의하여 규정되고 이행되고, 회원의 주거지와 관계없이 분쟁의 해결에 따른 준거법은 대한민국 법령으로 합니다. 서비스 이용과 관련하여 팀과 회원 간의 분쟁이 발생하면 당사자 사이의 해결을 위하여 노력하되, 그럼에도 불구하고 해결되지 아니하면 대한민국의 민사소송법에 따른 관할 법원에 소를 제기할 수 있습니다.
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
          <strong>부칙</strong><br />
          (개정 약관 적용 일자) 2025.9.1
          <br />본 약관은 관련 법령의 변경 또는 팀 정책에 따라 변경될 수 있습니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default TermsOfServicePage;
